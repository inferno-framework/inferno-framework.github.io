---
title: Testing the Tests
nav_order: 9
parent: Advanced Features
layout: docs
section: docs
---
# Testing the Tests with RSpec

Inferno supports [RSpec](https://rspec.info/) for automated unit testing of
Inferno code. RSpec a high level testing framework that comes with its own
[DSL](https://github.com/rspec/rspec/tree/main/rspec-core#readme),
[mocking](https://github.com/rspec/rspec/tree/main/rspec-mocks#readme),
and [web service stubbing](https://github.com/bblimke/webmock). RSpec
ensures robustness and quality assurance in Test Kits, especially
when they get large and complex.

## Running RSpec

Inferno sets up [Rake](https://ruby.github.io/rake/) to trigger testing by default
(`bundle exec rake`). However using RSpec directly gives more precise control over
the unit tests, such as only running the latest failure. **Rspec without Rake can
only be invoked from the Test Kit root directory**:

Run Rspec tests randomly:

```
bundle exec rspec
```

Run unit tests until the next failure with seed 42:

```
bundle exec rspec -n -s 42
```

See `bundle exec rspec --help` for all options. 

## Writing RSpec for an Inferno Server Tests

When Inferno is testing a FHIR server, it acts as a FHIR Client simulator. RSpec
then acts as a unit tester on the client simulator. Given the Inferno test code below:

```ruby
module ExampleTestKit
  class ExampleServerSuite < Inferno::TestSuite
    id 'example_server_suite'

    input :url
    input :bearer_token
    input :encounter_id

    fhir_client do
      url :url
      bearer_token :bearer_token
    end

    fhir_resource_validator do
    end

    group do
      id :encounter_group

      test do
        id :read
        title 'Read Encounter'

        makes_request :encounter_read

        run do
          fhir_read(:encounter, encounter_id, name: :encounter_read)

          assert_response_status(200)
          assert_resource_type(FHIR::Encounter)
        end
      end

      test do
        id :validate
        title 'Validate Encounter Resource'

        uses_request :encounter_read

        run do
          assert_valid_resource
        end
      end
    end
  end
end
```

The RSpec unit tests need to mock the inputs, the FHIR server endpoints, the Inferno Validator endpoints,
and the FHIR resource in question. Inferno core will auto-inject a
[shared context](https://github.com/inferno-framework/inferno-core/blob/main/spec/runnable_context.rb)
with helpers when writing a spec for a runnable (`Test`, `TestGroup`, or `TestSuite`).

```ruby
require 'example_test_kit/example_server_suite'

RSpec.describe ExampleTestKit::ExampleServerSuite do
  let(:suite_id) { 'example_server_suite' } # This is always required by Inferno Core's shared context
  let(:url) { 'https://fhir.example.com' }
  let(:bearer_token) { 'dummy_token' }
  let(:encounter_id) { '123' }

  let(:encounter_fixture_json) do
    File.read('spec/fixtures/encounter.json')
  end

  describe 'encounter group' do
    describe 'read test' do
      let(:test) { find_test(suite, 'read') } # `find_test` and `suite` are from Inferno Core
      # You must use `find_test` to load the test instead of
      # `described_class` or `Inferno::Repositories::Test#find`

      it 'passes if an Encounter was received' do
        stub_request(:get, "#{url}/Encounter/#{encounter_id}") # Stub FHIR server endpoint
          .to_return(status: 200, body: encounter_fixture_json)

        result = run(test, { url:, bearer_token:, encounter_id: }, {}) # `run(runnable, inputs, scratch)` is from Inferno Core

        expect(result.result).to eq('pass'), result.result_message
      end

      it 'fails if a Patient was recieved' do
        stub_request(:get, "#{url}/Encounter/#{encounter_id}")
          .to_return(status: 200, body: FHIR::Patient.new.to_json)

        result = run(test, { url:, bearer_token:, encounter_id: })
        expect(result.result).to eq('fail'), result.result_message
      end
    end

    describe 'validate test' do
      let(:test) { find_test(suite, 'validate') }
      let(:validation_success) do # stubbed response from Inferno Validator
        {
          outcomes: [{
                       issues: []
                     }],
          sessionId: test_session.id # `test_session` is from Inferno Core
        }.to_json
      end

      it 'passes if the resource is valid' do
        stub_request(:post, validation_url) # `validation_url` is from Inferno Core
          .to_return(status: 200, body: validation_success)

        repo_create(                            # `repo_create` is from Inferno Core
          :request,
          name: :encounter_read,                # stub for `uses_request`
          test_session_id: test_session.id,
          response_body: encounter_fixture_json
        )

        result = run(test, { url:, bearer_token:, encounter_id: })
        expect(result.result).to eq('pass'), result.result_message
      end
    end
  end
end
```

If writing a spec for a non-runnable class that needs the Inferno
Core helpers, add `:runnable` to the RSpec metadata. This is common
for modules that are imported into Inferno tests:

```ruby
class MyTest < Inferno::Test
  include MyModule
  # ... Inferno test code ...
end
```

```ruby
RSpec.describe MyModule, :runnable do
  # ... RSpec test code ...
end
```

## Writing RSpec for Inferno Client Tests

When Inferno tests a FHIR client, it acts a FHIR server simulator. RSpec
is therefore unit testing a server. Given the Inferno test code blow:

```ruby
module ExampleTestKit
  class EncounterEndpoint < Inferno::DSL::SuiteEndpoint
    def test_run_identifier
      request.headers['authorization']&.delete_prefix('Bearer ')
    end

    def make_response
      response.status = 200
      response.body = FHIR::Encounter.new(id: request.params[:id]).to_json
      response.format = :json
    end

    def update_result
      results_repo.update(result.id, result: 'pass')
    end

    def tags
      ['encounter_request']
    end
  end

  class ExampleClientSuite < Inferno::TestSuite
    id :example_client_suite
    input :bearer_token

    suite_endpoint :get, '/Encounter/:id', EncounterEndpoint

    group do
      id :client_group

      test do
        id :retrieve
        title 'Retrieve Encounter Resource'

        run do
          assert load_tagged_requests('encounter_request').any?
        end
      end
    end
  end
end
```

the RSpec test code for it is:

```ruby
require 'example_test_kit/example_client_suite'

RSpec.describe ExampleTestKit::ExampleClientSuite do
  let(:suite_id) { 'example_client_suite' }
  let(:bearer_token) { 'dummy_token' }

  describe 'retrieve encounter test' do
    let(:test) { find_test(suite, 'retrieve') }

    it 'passes after read encounter request received' do
      allow(test).to receive_messages(suite:)

      result = run(test, bearer_token:)
      expect(result.result).to eq('fail') # Assert test is fail before Encounter request

      repo_create(                        # Mock the Encounter retrieval request
        :request,
        verb: 'get',
        url: 'https://fhir.example.com/Encounter/123',
        direction: 'incoming',
        result_id: result.id,
        test_session_id: test_session.id,
        tags: ['encounter_request']
      )

      result = run(test, bearer_token:)   # Re-run test now that Encounter request was mocked
      expect(result.result).to eq('pass') # Assert test is pass after Encounter request
    end
  end
end
```

## RSpec for Inferno Platform Test Kits

Test Kits that will be deployed on an
[Inferno Platform](https://github.com/inferno-framework/inferno-platform-template/)
should conform to the platform deployable test kit spec. This spec is a set of
[shared RSpec examples](https://rspec.info/features/3-12/rspec-core/example-groups/shared-examples/)
which can be imported via:

```
RSpec.describe ExampleTestKit, order: :defined do
  it_behaves_like 'platform_deployable_test_kit'
end
```

## Using FactoryBot

Inferno comes with [FactoryBot](https://github.com/thoughtbot/factory_bot), which
enables the [factory pattern](https://en.wikipedia.org/wiki/Factory_method_pattern)
for quickly generating resources with minor differences. Writing factories with
[Faker](github.com/faker-ruby/faker) for randomized generation is a powerful tool.

For example, suppose the Test Kit specification requires checking patients with many
[HumanName](https://hl7.org/fhir/R4/datatypes.html#HumanName) variations, instead
of hardcoding a fixture for each one, define a factory that generates the combinations.

In `spec/factories/patient.rb`:

```ruby
FactoryBot.define do
  factory :patient, class: 'FHIR::Patient' do
    initialize_with { new(**attributes) }
    skip_create

    factory :patient_with_first_name do
      transient do
        given { Faker::Name.first_name }
      end
      name { { given: } }

      factory :patient_with_full_name do
        transient do
	        family { [ Faker::Name.middle_name, Faker::Name.last_name ] }
	      end
	      name { { given:, family: } }

        factory :patient_with_complex_name do
          transient do
            suffix { Faker::Name.suffix }
            prefix { Faker::Name.prefix }
          end
          name { { given:, family:, suffix:, prefix: } }
        end
      end
    end
  end
end
```

Then RSpec can generate those patients for its unit tests:

```ruby
RSpec.describe CheckPatientNameTest do
  let(:suite_id) { 'example_test_suite' }
  let(:test) { find_test suite, described_class.id }

  it 'passes patient with first name only' do
    result = run(test, { resource: create(:patient_with_first_name) })
    expect(result.result).to eq('pass')
  end

  it 'passes patient with full name' do
    result = run(test, { resource: create(:patient_with_full_name) })
    expect(result.result).to eq('pass')    
  end

  it 'passes patient with complex name' do
    result = run(test, { resource: create(:patient_with_complex_name) })
    expect(result.result).to eq('pass')
  end
end
```

