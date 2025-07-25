---
title: Navigating FHIR Resources
nav_order: 7
parent: Writing Tests
layout: docs
section: docs
---
# Navigating FHIR Resources
The FHIR resources returned from FHIR requests are instances of models defined
in the [fhir_models gem](https://github.com/fhir-crucible/fhir_models). These
models provide methods to access the fields in a FHIR resource.

```ruby
resource.id # returns a String containing the resource id

# Assuming this resource is a Patient:
resource.name # returns an Array of FHIR::HumanName
resource.name.first.family # returns a String containing the family name in the
                           # Patient's first name. This is not nil-safe! An
                           # error will be raised if resource.name is nil.
```

FHIR resources can be deeply nested, and navigating through deeply nested models
while also managing nil-safety can be cumbersome, so several methods are
provided to make it easier and safer to extract information from FHIR resources.

[`resolve_path`](/inferno-core/docs/Inferno/DSL/FHIRResourceNavigation.html#resolve_path-instance_method)
returns an Array containing all the values found at a given path, or an empty
Array if no values are found.

```ruby
patient_without_names = FHIR::Patient.new(id: 'no-names')
patient_with_a_name = FHIR::Patient.new(id: 'one-name', name: [{ family: 'ABC' }])
patient_with_names = FHIR::Patient.new(id: 'one-name', name: [{ family: 'ONE' }, { family: 'TWO' }])
resolve_path(patient_without_names, 'name')        # []
resolve_path(patient_without_names, 'name.family') # []
resolve_path(patient_with_a_name, 'name')          # [FHIR::HumanName(family: 'ABC')]
resolve_path(patient_with_a_name, 'name.family')   # ['ABC']
resolve_path(patient_with_names, 'name')           # [FHIR::HumanName(family: 'ONE'), FHIR::HumanName(family: 'TWO')]
resolve_path(patient_with_names, 'name.family')    # ['ONE', 'TWO']
```

[`find_a_value_at`](/inferno-core/docs/Inferno/DSL/FHIRResourceNavigation.html#find_a_value_at-instance_method)
only returns a single value from a given path. An optional block can be provided
to return the first value at a particular path for which the block returns a
truthy value. This method is particularly useful for finding values from a given
resource to use as values for search parameters.

```ruby
patient_without_names = FHIR::Patient.new(id: 'no-names')
patient_with_a_name = FHIR::Patient.new(id: 'one-name', name: [{ family: 'ABC' }])
patient_with_names = FHIR::Patient.new(id: 'one-name', name: [{ family: 'ONE' }, { family: 'TWO' }])
find_a_value_at(patient_without_names, 'name.family') # nil
find_a_value_at(patient_with_a_name, 'name.family')   # 'ABC'
find_a_value_at(patient_with_names, 'name.family')    # 'ONE'

find_a_value_at(patient_without_names, 'name.family') { |family| family == 'ABC' } # nil
find_a_value_at(patient_with_a_name, 'name.family') { |family| family == 'ABC' }   # 'ABC'
find_a_value_at(patient_with_names, 'name.family') { |family| family == 'ABC' }    # nil
```
