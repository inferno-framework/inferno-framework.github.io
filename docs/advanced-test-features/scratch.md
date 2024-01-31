---
title: Scratch
nav_order: 4
parent: Advanced Features
layout: docs
section: docs
---
# Scratch
Scratch provides an alternative to inputs and outputs for passing information
between tests. The table below shows the main differences between the two options:

| Inputs/Outputs | Scratch |
| --- | --- |
| Stored in the database | Stored in memory |
| Strings | Any data type |
| Persist through an entire test session | Lifetime limited to a single test run |
| Input values only change if they are a test output &emsp; | Any test can change scratch |
{: .scratch-grid }

&nbsp;

Inputs are loaded from the database at the start of each test, so the
major advantage of scratch is that its contents are stored in memory. Also, if tests require a large
number of complex objects, scratch provides a way to avoid repeatedly loading,
deserializing, and instantiating them. The major limitation of scratch, however, is that
it only persists through a single test run (i.e., a single click of the _Run
Tests_ button). Inputs and outputs are therefore recommended over scratch when
possible. 

## Example
`scratch` is a plain Hash that is passed to each test. It persists
throughout a single test run, and changes made to it in one test will be visible to
any subsequent tests in that run.

```ruby
class MyGroup < Inferno::TestGroup
  # Since scratch is lost at the end of a test run, by making this group run
  # together, that ensures that the tests run together and the scratch will
  # remain present.
  run_as_group
  
  test do
    run do
      # retrieve a large number of FHIR resources
      # ...
      
      # store resources in scratch
      scratch[:observations] = a_large_number_of_fhir_observations
      scratch[:conditions] =  a_large_number_of_fhir_conditions
    end
  end
  
  test do
    run do
      # read resources from scratch
      perform_some_operation_on(scratch[:observations])
    end
  end
  
  test do
    run do
      # read resources from scratch
      perform_some_operation_on(scratch[:conditions])
    end
  end
end
```
