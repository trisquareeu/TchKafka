# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.1.0 (2024-06-15)


### Bug Fixes

* add permission for dependabot for repository contents ([fd18735](https://github.com/trisquareeu/TchKafka/commit/fd18735b6e340f8eb8c45d62216ecb7b9bffc4bb))
* add permissions for dependabot to write pull-requests ([251913d](https://github.com/trisquareeu/TchKafka/commit/251913d6ae64a96dc1f71d6762eaadd4f8f4a457))
* don't use synchronous versions of cpu intensive functions ([e67712e](https://github.com/trisquareeu/TchKafka/commit/e67712e54559928d339d6e9cd44a1d0b91727506))
* format imports ([19d7136](https://github.com/trisquareeu/TchKafka/commit/19d71367c327cf24a1f797fa1eb0c0d844875db7))
* **primitives:** throw when invalid number of records has been received in record batch ([280ce39](https://github.com/trisquareeu/TchKafka/commit/280ce39e57a9e48560709a9a7c931445eef4033a)), closes [#50](https://github.com/trisquareeu/TchKafka/issues/50)
* **primitives:** update record to use proper data from kafka protocol ([bc58b66](https://github.com/trisquareeu/TchKafka/commit/bc58b66500f41dca672340339e2730b2774dba62))
* **primitives:** use proper serialization for record headers ([01acb27](https://github.com/trisquareeu/TchKafka/commit/01acb275a6bb3952546715c5ff39e51adb1a6cbd))
* **protocol:** use more strict equal operator in uvarint ([f275500](https://github.com/trisquareeu/TchKafka/commit/f275500323705abfe5f6449b330ebb464126bd36))
* **serialization:** use proper test lib ([5c4f3c1](https://github.com/trisquareeu/TchKafka/commit/5c4f3c1563f1a7c46dfe4a2b8fd8df9067c064aa))


### Features

* add Client and Session ([f5c0a49](https://github.com/trisquareeu/TchKafka/commit/f5c0a49cbbf99317d6a701d21a2a314e89fe7cae))
* add dependabot ([94252d8](https://github.com/trisquareeu/TchKafka/commit/94252d8ba7d4e37ffe478e2fcd9b3920aa014a94)), closes [#7](https://github.com/trisquareeu/TchKafka/issues/7)
* add record and record batch types ([e85d5ee](https://github.com/trisquareeu/TchKafka/commit/e85d5ee3a821eeb00d7f9a799df35a6ccfd65167)), closes [#22](https://github.com/trisquareeu/TchKafka/issues/22)
* add scram authentication ([9f74919](https://github.com/trisquareeu/TchKafka/commit/9f74919c65baa77fee98ec44cd27705c187cd07f))
* add ssl connection support ([aeb1ef6](https://github.com/trisquareeu/TchKafka/commit/aeb1ef6d7ec3692d9a5a3b766d0c6c0128962db5))
* add support for authentication methods ([18385bb](https://github.com/trisquareeu/TchKafka/commit/18385bbf958ba062bcceb7466f5c53f3e251f756))
* change request to not always require a response ([c96d367](https://github.com/trisquareeu/TchKafka/commit/c96d367e0a9c43cc8ea4dca55a8cfa458a0e4689))
* **ci:** add matrix to run with multiple node versions ([2956934](https://github.com/trisquareeu/TchKafka/commit/295693475fc9ef52a587b177d01bd275bd44e743))
* **ci:** add timeout for the ci job ([4d97ce5](https://github.com/trisquareeu/TchKafka/commit/4d97ce5ef89275ab0d8fd2407ca2bac07a2ddbe9))
* **ci:** enable auto review of dependabot prs ([2826b4f](https://github.com/trisquareeu/TchKafka/commit/2826b4ff4ea09315a3f519196c05d5a842ae504b))
* **ci:** enable automerging for dependabot ([3c7e87a](https://github.com/trisquareeu/TchKafka/commit/3c7e87a11ea4e37c5020c7ce03de15e18bd799b2)), closes [#121](https://github.com/trisquareeu/TchKafka/issues/121)
* **ci:** introduce ci ([5934617](https://github.com/trisquareeu/TchKafka/commit/59346176d12f360c4fd7d56dfcd7133da96f5dda))
* **compression:** add different types of compression ([83afac4](https://github.com/trisquareeu/TchKafka/commit/83afac4aa35515b37f346d9cccfef82cf2efd74f)), closes [#26](https://github.com/trisquareeu/TchKafka/issues/26)
* connection error handling ([8414f82](https://github.com/trisquareeu/TchKafka/commit/8414f828805e84428f3bb218f8b68881015ba6c9))
* **connection:** create representation of the connection with broker ([dc4f1f5](https://github.com/trisquareeu/TchKafka/commit/dc4f1f5b7f3693acd0ee15f2b5d70664a109dfe9)), closes [#18](https://github.com/trisquareeu/TchKafka/issues/18)
* **deps:** install testcontainers ([9a7efb7](https://github.com/trisquareeu/TchKafka/commit/9a7efb7c219461bf819e9d3aedf6338841b3f28e))
* extend request interface with apiVersions and apiKey ([ea35ab7](https://github.com/trisquareeu/TchKafka/commit/ea35ab7f751bdd417cabd1a28405fea612696530))
* introduce request builder, move correlationId out of Connection ([e043836](https://github.com/trisquareeu/TchKafka/commit/e04383625664ab7d37c7d704ba4a9e28dc21f9ae))
* **primitives:** add non nullable array type ([52e4d43](https://github.com/trisquareeu/TchKafka/commit/52e4d433591ec82dc26c5f3984dcb3f78b8db5b1))
* **protocol:** add api versions request ([26b6536](https://github.com/trisquareeu/TchKafka/commit/26b65366d62863956cb709a9ec8d0a77be9cae0c)), closes [#19](https://github.com/trisquareeu/TchKafka/issues/19)
* **protocol:** add metadata request ([2fbd8b3](https://github.com/trisquareeu/TchKafka/commit/2fbd8b3e7a0f8aaa57c68b13325fb73a5a12fccb))
* **protocol:** add produce request ([ef63cd8](https://github.com/trisquareeu/TchKafka/commit/ef63cd88e0c7e9ade4ef7e35ca1ce12ef95dd487))
* **protocol:** add SaslAuthenticate and SaslHandshake requests ([8d8b255](https://github.com/trisquareeu/TchKafka/commit/8d8b255a7af7d53fa37800c7df9f797809ca74c5))
* **protocol:** add varlong primitive type ([92af8ca](https://github.com/trisquareeu/TchKafka/commit/92af8ca39f4f4a395afe90e8c2802bbbcc7a96ca)), closes [#23](https://github.com/trisquareeu/TchKafka/issues/23)
* **protocol:** implement kafka protocol primitives ([0f67c82](https://github.com/trisquareeu/TchKafka/commit/0f67c8268a258071e8ce2c0ca4780d2824de198a)), closes [#17](https://github.com/trisquareeu/TchKafka/issues/17)
* **protocol:** implement request and response headers ([f361793](https://github.com/trisquareeu/TchKafka/commit/f361793616dbebdd6f38ce0156466df0502051a9)), closes [#20](https://github.com/trisquareeu/TchKafka/issues/20)
* **sasl:** add plain authentication mechanism ([5757e4e](https://github.com/trisquareeu/TchKafka/commit/5757e4e5d600eae9d1735f1a35482b0c19adcb45))
* **sasl:** add scram authentication mechanism ([5366267](https://github.com/trisquareeu/TchKafka/commit/5366267d452e2f97a9c741c597491b4271c7a638))
* **security:** implement SaslAuthenticator ([f3a21fa](https://github.com/trisquareeu/TchKafka/commit/f3a21fa2dc0e520a9a1f1242f404232eccb0a235))
* **serialization:** update serialize methods to return Promises ([549a307](https://github.com/trisquareeu/TchKafka/commit/549a307d95d58e167d461dc04e0fa05e4cd6ec99))
* use template method for request builder ([c8ceee4](https://github.com/trisquareeu/TchKafka/commit/c8ceee4002b644e109436c4ceec6681ab4d49a80))
