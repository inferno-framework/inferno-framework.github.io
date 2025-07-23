---
title: Inputs and Outputs
nav_order: 3
parent: Writing Tests
layout: docs
section: docs
---
{:toc-skip: .h4 data-toc-skip=""}

# Inputs and Outputs
Inputs and outputs provide a structured way to pass information into and out of
tests. When a user initiates a test run, a modal is displayed for providing input values.
When multiple tests are run together, the user will not be
prompted for inputs that are populated by the output of a previous test
in the run. Currently, all inputs and outputs are stored as strings.

## Inputs

### Defining Inputs
{:toc-skip}

The `input` method defines an input. `input` can take several arguments, but
only the identifier is required:
- `identifier` - (**required**) a name for this input. The input value is
  available in the run block using this name.
- `title:` -  a title which is displayed in the UI.
- `description:` - a description which is displayed in the UI.
- `type:` - controls the type of HTML input element used in the UI. Currently
  there are 5 possible values:
  - `'text'` - (**default**) a regular input field.
  - `'textarea'` - for a text area input field.
  - `'radio'` - for a radio button singular selection field.
  - `'checkbox` - for a checkbox field. In tests, a checkbox input is
    represented as an array of the selected values.
  - `'oauth_credentials'` - a complex type for storing OAuth2 credentials. When
    used by a FHIR client, the access token will automatically refresh if
    possible.
- `default:` - default value for the input.
- `optional:` - (**default: false**) whether the input is optional.
- `options:` - possible input option formats based on input type.
  - `list_options:` - options for input formats that require a list of possible
    values (radio and checkbox). An array of hashes with `label` and `value`
    keys.
- `locked:` - (**default: false**) whether the user can alter the input's value.
  Locking an input can force it to use a value from a previous test's output, or
  the default value.
- `hidden:` - (**default: false**) hide the input from the UI. Must be used with either `optional: true` or `locked: true`.

Here is a simple example:
```ruby
test do
  input :url,
        title: 'FHIR Server Url',
        description: 'The base url for the FHIR server'

  run do
    # The input's identifier is :url, so its value is available via `url`
    assert url.start_with?('https'), 'The server must support https'
  end
end
```
[`input` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#input-instance_method)

### Defining Multiple Inputs
{:toc-skip}

It is possible to define multiple inputs in a single `input` call, though this
prevents the use of the additional properties listed above. This can be useful when a test
uses inputs that have been defined in a parent or sibling.

```ruby
test do
  input :input1, :input2, :input3, :input4
  ...
end
```

### Inputs with List Options
{:toc-skip}

For the `radio` or `checkbox` input types, a list of options must be provided.
The `label` is displayed to the user, and the `value` is the actual value that
is stored when the user selects that option.

```ruby
test do
  input :radio_input_example,
        title: 'Example Radio Input',
        type: 'radio',
        options: {
          list_options: [
            {
              label: 'Radio Option 1',
              value: 'option_1'
            },
            {
              label: 'Radio Option 2',
              value: 'option_2'
            }
          ]
        }

  input :checkbox_input_example,
        title: 'Example Checkbox Input',
        type: 'checkbox',
        options: {
          list_options: [
            {
              label: 'Checkbox Option 1',
              value: 'option_1'
            },
            {
              label: 'Checkbox Option 2',
              value: 'option_2'
            }
          ]
        }

  run do
    if radio_input_example == 'option_1'
      # ...
    end

    if radio_input_example == 'option_2'
      # ...
    end

    if checkbox_input_example.include? 'option_1'
      # ...
    end

    if checkbox_input_example.include? 'option_2'
      # ...
    end
  end
end
```

It is possible to lock individual checkbox items. In the following example,
`Item 1` is not locked, so the user can check and uncheck it freely. `Item 2` is
checked because it is included in the `default`, and the user can not uncheck
it. `Item 3` is unchecked because it is not included in the `default`, and the
user can not check it.

```ruby
input :locked_checkbox_example,
      title: 'Locked Checkbox Input Example',
      type: 'checkbox',
      default: ['value2'],
      options: {
        list_options: [
          {
            label: 'Item 1',
            value: 'value1'
          },
          {
            label: 'Item 2 - Locked checked',
            value: 'value2',
            locked: true
          },
          {
            label: 'Item 3 - Locked unchecked',
            value: 'value3',
            locked: true
          }
        ]
      }
```

### Hidden Inputs
{:toc-skip}

The `hidden:` property (default: `false`) can be used to hide an input from the UI.
Hidden inputs must be either optional or locked. If neither is true, an error will be raised.

```ruby
input :hidden_value,
      title: 'Hidden Input',
      hidden: true,
      optional: true
```

### Ordering Inputs
{:toc-skip}

When a group or suite displays all of its descendants' inputs, they may be in an
unintuitive order. They can be reordered using `input_order`.
```ruby
group do
  input_order :input_2, :input_1

  test do
    input :input_1
  end

  test do
    input :input_2
  end
end
```

#### Additional Input Instructions
If a developer wants to include additional input instructions, they can define `input_instructions`
which will be displayed above the inputs.

```ruby
group do
  input_instructions %(
    Register Inferno as a standalone application using the following information:

    * Redirect URI: `#{SMARTAppLaunch::AppRedirectTest.config.options[:redirect_uri]}`

    Enter in the appropriate scope to enable patient-level access to all
    relevant resources. If using SMART v2, v2-style scopes must be used. In
    addition, support for the OpenID Connect (openid fhirUser), refresh tokens
    (offline_access), and patient context (launch/patient) are required.
  )
end
```

## Outputs

### Defining Outputs
{:toc-skip}

The `output` method defines an output. It is used in a test's definition block
to define which outputs a test provides, and within a test's `run` block to
assign a value to an output. Multiple outputs can be defined and assigned at once.

```ruby
test do
  output :value1
  output :value2, :value3

  run do
    output value1: 'ABC'
    output value2: 'DEF',
           value3: 'GHI'
  end
end

test do
  # These inputs will automatically get their values from the previous test's
  # outputs.
  input :value1, :value2, :value3
  ...
end
```
[`output` for defining outputs in the API docs](/inferno-core/docs/Inferno/Entities/Test.html#output-class_method)

[`output` for assigning values to outputs in the API
docs](/inferno-core/docs/Inferno/Entities/Test.html#output-instance_method)

## Handling Complex Objects
Since inputs and outputs are all stored as strings, special handling is needed
if passing complex objects between tests. This can
generally be handled using JSON serialization. Ruby hashes and arrays, as well
as FHIR model classes, support the `to_json` method, which turns an object into a JSON
string.

```ruby
test do
  output :complex_object_json

  run do
    ...
    output complex_object_json: hash_or_array_or_fhir_resource.to_json
  end
end

test do
  input :complex_object_json

  run do
    assert_valid_json(complex_object_json) # For safety

    complex_object = JSON.parse(complex_object_json)
    ...
  end
end
```

## Behind the Scenes
Inputs and outputs work as a single key-value store scoped to a test session.
The main differences between them are:
- An input's value can not be changed
during a test
- Inputs support additional metadata for display in the UI
(title, description, etc.)

Since inputs and outputs form a single key-value
store, a value will be overwritten if multiple tests write to the same output.
However, each test result stores the input and output values that were present for
that particular test.

## Merging Behavior (Advanced)

When inputs are defined at multiple levels (e.g., group and test), Inferno merges them. The following rules apply:

- `locked`, `hidden`, and `type` are **not inherited** when merging input definitions between parent and child.
- Other attributes such as `title`, `description`, `default`, and `optional` **are inherited**.

This allows different test scopes to override specific input behaviors without affecting others.

Additionally, when inputs are merged with external configuration, `type` and `options` are also excluded from automatic merging.
