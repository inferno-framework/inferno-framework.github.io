---
layout: news
title: "Inferno Core Release v0.5.0!"
section: news
date: 2024-11-04
---

Inferno Core has been updated from v0.4.44 to v0.5.0, which includes a speed boost in load times in 
exchange for a technically breaking but minor change. We discuss the change in this post.

<!-- break -->

## v0.5.0 Release

Inferno Core is still at major version 0 of [Semantic Versioning](https://semver.org), so we reflect breaking
changes by [incrementing the middle integer](https://semver.org/#spec-item-8).

Inferno Core v0.5.0 added a small change that disallows duplicate ids for Tests, Test Groups, and Test
Suites in Inferno. While this is a technically a breaking change, we do not expect this to cause an
issue in the majority of Test Kits and users out there. The motivation for this change was painfully
slow load times in some of our Test Kits, and after profiling the issue we found that duplicate ids
in the database was causing the slowdown. After this update we saw significant improvements in performance.

Most Test Kits are likely running on Inferno Core v0.4.x, and if this suits your needs there is no need
to update. If you want the performance improvements you can run `bundle update inferno_core` in
your Test Kit directory. If there is a duplicate id in your Test Kit, the command `bundle exec inferno start`
will fail to start, and you need to go rename one or more ids in the Test Kit.

You can see the
[v0.5.0 release on GitHub](https://github.com/inferno-framework/inferno-core/releases/tag/v0.5.0)
for more details.

## Next Steps

We'll keep improving the Inferno Core, the Inferno Framework site, and the FHIR Community
as a whole with future releases. As always, we welcome your feedback and ideas for improvement.
Thank you for your continued support!
