# ModelSEED-Solr

Schema and config files for the ModelSEED Solr instance

### Requirements

The configuration currently requires a custom SOLR build, `solr-5.3.0-PATRIC.tgz`, which has the custom type `string_ci`.

### Development

Install `SOLR-5.3.0`:

```
tar -xvf solr-5.3.0-PATRIC.tgz
```

Clone this repo (anywhere you'd like):

```
cd solr-5.3.0-PATRIC
git clone https://github.com/ModelSEED/ModelSEED-Solr.git 
```

Start the server with the full path to to the clone repo:

```
./bin/solr start -Dsolr.solr.home=/Users/../solr-5.3.0-PATRIC/ModelSEED-Solr -Dlucene.version=5.3.0
```

You can stop the server with `stop`, or restart the server with `restart`.

### Production

(more soon...)



