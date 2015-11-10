# ModelSEED-Solr

Schema and config files for the ModelSEED Solr instance

### Requirements

The configuration currently requires a custom SOLR build, `solr-5.3.0-PATRIC.tgz`, which has the custom type `string_ci`.

### Development

Install `solr-5.3.0-PATRIC`:

```
tar -xvf solr-5.3.0-PATRIC.tgz
```

Clone this repo (anywhere you'd like):

```
git clone https://github.com/ModelSEED/ModelSEED-Solr.git 
```

Start the server with the full path to the cloned repo:

```
./bin/solr start -Dsolr.solr.home=/Users/../ModelSEED-Solr -Dlucene.version=5.3.0
```

You can stop the server with `stop`, or restart the server with `restart`.

### Production

(more soon...)



