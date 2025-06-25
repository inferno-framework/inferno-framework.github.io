---
title: Writing Tests
nav_order: 13
has_children: true
layout: docs
section: docs
---
# Writing Tests in Inferno

## Test Suite Structure
There are three classes used to organize tests in Inferno:
- `TestSuite` - An entire suite of tests. A `TestSuite` can contain one or more `TestGroup` classes.
- `TestGroup` - A `TestGroup` can contain one or more `TestGroup` or `Test` classes.
- `Test` - An individual test. A `Test` contains a `run` block which defines what
  happens when the test is run.

In the Inferno DSL, each is considered a [Runnable](/inferno-core/docs/Inferno/DSL/Runnable.html). 

For example, a simple US Core test suite might look like this:
- US Core (`TestSuite`)
  - US Core Patient Group (`TestGroup`)
    - Server supports Patient Read Interaction (`Test`)
    - Server supports Patient Search by id (`Test`)
  - US Core Condition Group (`TestGroup`)
    - Server supports Condition Read Interaction (`Test`)
    - Server supports Condition Search by Patient (`Test`)

## Defining Groups and Tests
Let's show how to add groups and tests to a `TestSuite` using the above US Core example.
To start, we define the groups in the `TestSuite` using the `group` method.

```ruby
# lib/us_core_test_kit.rb
module USCoreTestKit
  class USCoreTestSuite < Inferno::TestSuite
    group do
      title 'US Core Patient Group'
    end

    group do
      title 'US Core Condition Group'
    end
  end
end
```

We can then add the tests to each group using the `test` method:

```ruby
# lib/us_core_test_kit.rb
module USCoreTestKit
  class USCoreTestSuite < Inferno::TestSuite
    group do
      title 'US Core Patient Group'

      test do
        title 'Server supports Patient Read Interaction'
        input :patient_id

        run do
          # test code goes here
        end
      end

      test do
        title 'Server supports Patient Search by id'
        input :patient_id

        run do
          # test code goes here
        end
      end
    end

    group do
      title 'US Core Condition Group'

      test do
        title 'Server supports Condition Read Interaction'
        input :condition_id

        run do
          # test code goes here
        end
      end

      test do
        title 'Server supports Condition Search by Patient'
        input :patient_id

        run do
          # test code goes here
        end
      end
    end
  end
end
```
This test suite is already getting pretty long. We can improve the organization
using externally defined groups and tests.

## Externally Defined Groups and Tests
Let's move the Patient and Condition groups into their own files, and assign
them ids.

```ruby
# File: lib/us_core_test_kit/us_core_patient_group.rb
module USCoreTestKit
  class USCorePatientGroup < Inferno::TestGroup
    title 'US Core Patient Group'
    id :us_core_patient

    test do
      title 'Server supports Patient Read Interaction'
      input :patient_id

      run do
        # test code goes here
      end
    end

    test do
      title 'Server supports Patient Search by id'
      input :patient_id

      run do
        # test code goes here
      end
    end
  end
end

# File: lib/us_core_test_kit/us_core_condition_group.rb
module USCoreTestKit
  class USCoreConditionGroup < Inferno::TestGroup
    title 'US Core Condition Group'
    id :us_core_condition

    test do
      title 'Server supports Condition Read Interaction'
      input :condition_id

      run do
        # test code goes here
      end
    end

    test do
      title 'Server supports Condition Search by Patient' 
      input :patient_id

      run do
        # test code goes here
      end
    end
  end
end
```

Now the suite can include these groups without having to contain their entire
definitions.

```ruby
# File: lib/us_core_test_kit.rb
require_relative 'us_core_test_kit/us_core_patient_group'
require_relative 'us_core_test_kit/us_core_condition_group'

module USCoreTestKit
  class USCoreTestSuite < Inferno::TestSuite
    group from: :us_core_patient
    group from: :us_core_condition
  end
end
```

We can take it a step further and move the tests into their own files. This is often
beneficial because it encourages decoupling tests from each other, and allows for more
dynamic test group composition.

```ruby
# File: lib/us_core_test_kit/us_core_patient_read_test.rb
module USCoreTestKit
  class USCorePatientReadTest < Inferno::Test
    title 'Server supports Patient Read Interaction'
    id :us_core_patient_read
    input :patient_id

    run do
      # test code goes here
    end
  end
end

# File: lib/us_core_test_kit/us_core_patient_search_by_id_test.rb
module USCoreTestKit
  class USCorePatientSearchByIdTest < Inferno::TestGroup
    title 'Server supports Patient Search by id'
    id :us_core_patient_search_by_id
    input :patient_id

    run do
      # test code goes here
    end
  end
end
```

And then add each `Test` to their respective `TestGroup`.

```ruby
# lib/us_core_test_kit/us_core_patient_group.rb
require_relative 'us_core_patient_read_test'
require_relative 'us_core_patient_search_by_id_test'

module USCoreTestKit
  class USCorePatientGroup < Inferno::TestGroup
    title 'US Core Patient Group'
    id :us_core_patient

    test from: :us_core_patient_read
    test from :us_core_patient_search_by_id
  end
end
```

Note: When importing a group, its optional children can be omitted:

```ruby
group from: :us_core_patient, exclude_optional: true
```

## Repeated Groups and Tests

When it is necessary to repeat a group or test multiple times, the id must be
changed to avoid conflicts. This new id must be specified as a keyword argument
to the `group`/`test` call rather than in a block.

```ruby
group from: :us_core_patient

# Change the id of subsequent instances using a keyword argument
group from: :us_core_patient, id: :us_core_patient_2 do
  # Further configuration
end

# Do not try to change the id in the block
group from: :us_core_patient do
  id :us_core_patient_3 # This will not work properly
end
```

## Importing From Other Test Kits

Inferno Test Kits may include other Test Kits as a dependency. This allows you to
reuse existing tests, test groups or test suites as part of your own tests.  This is helpful
if your testing requires common functionality already covered by existing Test Kits, such as
[SMART App Launch](https://github.com/inferno-framework/smart-app-launch-test-kit) for testing 
connecting to a FHIR Server, and [Bulk Data Access Test Kit](https://github.com/inferno-framework/bulk-data-test-kit) for
exporting bulk data from a FHIR Server.

To start, add each Test Kit you want to import as a runtime dependency in the `.gemspec` 
file of your test kit, as you would for additional Ruby gems.

```ruby
  # Import additional Test Kits
  spec.add_runtime_dependency 'smart_app_launch_test_kit', '0.4.5'
  spec.add_runtime_dependency 'bulk_data_test_kit', '0.10.0'
```

Then you would add `require` statements for each Test Kit to your main Test Kit Ruby file.

```ruby
# lib/my_custom_test_kit.rb
require 'bulk_data_test_kit'
require 'smart_app_launch_test_kit'

module MyCustomTestKit
  class MyTestSuite < Inferno::TestSuite
   ...
  end
end
```

Test Suites, Groups, Tests and configuration options from the imported Test Kits can be referenced from the imported Test Kit.
Include the required suite, and then reference test groups with the appropriate id.

```ruby
# File: lib/my_custom_test_kit/my_test_suite.rb

require_relative 'ehr_launch_group_stu2'
require_relative 'app_launch_test'

module MyCustomTestKit
  class MyEHRLaunchSuite < Inferno::TestSuite
    id :my_kit_smart_ehr_launch
    title 'Custom EHR SMART App Launch'
      
    run_as_group
    
    # import entire group
    group from: :smart_ehr_launch_stu2,
      run_as_group: true
    
    group do
      title 'My Custom Group'
      id :my_custom_group
      
      # import individual test
      test from: :smart_app_launch
      test do
        title 'Check for response with missing data'
        ...
      end
    end
  end
end
```

You can reuse groups and tests in your Test Kit, and customize them with your own configuration.

```ruby
group from: :smart_discovery_stu2,
  title 'Custom Group Title'
  description %(
    # My Customized group description...
  )
  id :my_smart_discovery_group

  config: {
    inputs: {
        url: { name: :bulk_server_url } 
    }
  }
```

            
