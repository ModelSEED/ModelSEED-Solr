
## SOLR-CDDTable.txt:

- Remove blank line (line 2)

To see:
```
sed -n -e 2,2 SOLR-CDDTable.txt 

```

To remove:
```
sed -e 2d SOLR-CDDTable.txt  > blah.txt
```

- Change first "genes" column to "gene_count".

```
id,accession,name,length,gene_count,fullgenes,is_full_gene,longgenes,description,set,genes,set_name
```

- Had to break file into smaller files:

```
 sed -n -e 1p -e 2,10000p     SOLR-CDDTable-fixed-final.txt > SOLR-CDDTable-1.txt &&
 sed -n -e 1p -e 10001,20000p SOLR-CDDTable-fixed-final.txt > SOLR-CDDTable-2.txt &&
 sed -n -e 1p -e 20001,30000p SOLR-CDDTable-fixed-final.txt > SOLR-CDDTable-3.txt &&
 sed -n -e 1p -e 30001,40000p SOLR-CDDTable-fixed-final.txt > SOLR-CDDTable-4.txt 
```

## SOLR-CDDSets.txt

line 2866 is foobar.

```
sed -n -e 2866,2866p SOLR-CDDSets.txt 
									Number core CDDs		0
```

### To fix this:

```
sed -e 2866d SOLR-CDDSets.txt  >  SOLR-CDDSets-fixed.txt
```

## SOLR-FusionTable.txt:

1. Sanitized header  TODO: remove hyphens... still need to do some of this
2. There are two "functions" and two "lengths".  TODO: do this.
    * Use "Function".  
    * Use smaller of "length" and "Length".
3. There are 5000+ rows that don't have an entry for the column "sequence".  Added "no_sequence" for these.
4. Broke file into smaller files.

### Header can be fixed with this:

```
./columns.js --file ../../test-data/SOLR-FusionsTable.txt  --fix-header gene,divide,score,left,right,overlap,left_sg,right_sg,overlap_sg,matches,best_left,best_right,best_left_align,best_right_align,left_links,right_links,set_count,function,length,contig,direction,start,stop,species,sequence,cdds > ../../test-data/corrected-fusions.txt
```

### #3 can be fixed with: 

```
./columns.js --file ../../test-data/SOLR-FusionsTable.txt  --insert-at-column 26 --insert-value=no_sequence > ../../test-data/corrected-fusions.txt
```


### #4 can be solved by breaking up the file.  Something like:

```
sed -n -e 1p -e 2,500000p         SOLR-FusionsTable.txt > SOLR-FusionsTable-1.txt &&
sed -n -e 1p -e 500001,1000000p   SOLR-FusionsTable.txt > SOLR-FusionsTable-2.txt &&
sed -n -e 1p -e 1000001,1500000p  SOLR-FusionsTable.txt > SOLR-FusionsTable-3.txt &&
sed -n -e 1p -e 1500001,2000000p  SOLR-FusionsTable.txt > SOLR-FusionsTable-4.txt &&
sed -n -e 1p -e 2000001,2500000p  SOLR-FusionsTable.txt > SOLR-FusionsTable-5.txt &&
sed -n -e 1p -e 2500001,3000000p  SOLR-FusionsTable.txt > SOLR-FusionsTable-6.txt &&
sed -n -e 1p -e 3000001,3500000p  SOLR-FusionsTable.txt > SOLR-FusionsTable-7.txt &&
sed -n -e 1p -e 3500001,4000000p  SOLR-FusionsTable.txt > SOLR-FusionsTable-8.txt 
```


Remaining issue in SOLR-FusionsTable-6.txt:


nconrad@branch:~/solr-data2$ /opt/solr/bin/post  -c fusions -params "separator=%09&f.cdds.split=true&f.cdds.separator=%3B" -type text/csv SOLR-FusionsTable-6.txt
java -classpath /opt/solr/dist/solr-core-5.3.0-PATRIC.jar -Dauto=yes -Dparams=separator=%09&f.cdds.split=true&f.cdds.separator=%3B -Dtype=text/csv -Dc=fusions -Ddata=files org.apache.solr.util.SimplePostTool SOLR-FusionsTable-6.txt
SimplePostTool version 5.0.0
Posting files to [base] url http://localhost:8983/solr/fusions/update?separator=%09&f.cdds.split=true&f.cdds.separator=%3B...
Entering auto mode. File endings considered are xml,json,csv,pdf,doc,docx,ppt,pptx,xls,xlsx,odt,odp,ods,ott,otp,ots,rtf,htm,html,txt,log
POSTing file SOLR-FusionsTable-6.txt (text/csv) to [base]
SimplePostTool: WARNING: Solr returned an error #400 (Bad Request) for url: http://localhost:8983/solr/fusions/update?separator=%09&f.cdds.split=true&f.cdds.separator=%3B
SimplePostTool: WARNING: Response: <?xml version="1.0" encoding="UTF-8"?>
<response>
<lst name="responseHeader"><int name="status">400</int><int name="QTime">194907</int></lst><lst name="error"><str name="msg">CSVLoader: input=null, line=178020,can't read line: 178020
	values={NO LINES AVAILABLE}</str><int name="code">400</int></lst>
</response>
SimplePostTool: WARNING: IOException while reading response: java.io.IOException: Server returned HTTP response code: 400 for URL: http://localhost:8983/solr/fusions/update?separator=%09&f.cdds.split=true&f.cdds.separator=%3B
1 files indexed.
COMMITting Solr index changes to http://localhost:8983/solr/fusions/update?separator=%09&f.cdds.split=true&f.cdds.separator=%3B...
Time spent: 0:03:26.586


In ~/solr-data/SOLR-CDDTable-1.txt:

nconrad@branch:~/solr-data2$ /opt/solr/bin/post -c fusion-cdd -params "separator=%09&f.genes.split=true&f.genes.separator=%3B&f.set.keepEmpty=false" -type text/csv ~/solr-data/SOLR-CDDTable-1.txt 
java -classpath /opt/solr/dist/solr-core-5.3.0-PATRIC.jar -Dauto=yes -Dparams=separator=%09&f.genes.split=true&f.genes.separator=%3B&f.set.keepEmpty=false -Dtype=text/csv -Dc=fusion-cdd -Ddata=files org.apache.solr.util.SimplePostTool /homes/nconrad/solr-data/SOLR-CDDTable-1.txt
SimplePostTool version 5.0.0
Posting files to [base] url http://localhost:8983/solr/fusion-cdd/update?separator=%09&f.genes.split=true&f.genes.separator=%3B&f.set.keepEmpty=false...
Entering auto mode. File endings considered are xml,json,csv,pdf,doc,docx,ppt,pptx,xls,xlsx,odt,odp,ods,ott,otp,ots,rtf,htm,html,txt,log
POSTing file SOLR-CDDTable-1.txt (text/csv) to [base]
SimplePostTool: WARNING: Solr returned an error #400 (Bad Request) for url: http://localhost:8983/solr/fusion-cdd/update?separator=%09&f.genes.split=true&f.genes.separator=%3B&f.set.keepEmpty=false
SimplePostTool: WARNING: Response: <?xml version="1.0" encoding="UTF-8"?>
<response>
<lst name="responseHeader"><int name="status">400</int><int name="QTime">647959</int></lst><lst name="error"><str name="msg">CSVLoader: input=null, line=7843,can't read line: 7843
	values={NO LINES AVAILABLE}</str><int name="code">400</int></lst>
</response>
SimplePostTool: WARNING: IOException while reading response: java.io.IOException: Server returned HTTP response code: 400 for URL: http://localhost:8983/solr/fusion-cdd/update?separator=%09&f.genes.split=true&f.genes.separator=%3B&f.set.keepEmpty=false
1 files indexed.
COMMITting Solr index changes to http://localhost:8983/solr/fusion-cdd/update?separator=%09&f.genes.split=true&f.genes.separator=%3B&f.set.keepEmpty=false...
Time spent: 0:10:53.059
nconrad@branch:~/solr-data2$ /opt/solr/bin/post -c fusion-cdd -params "separator=%09&f.genes.split=true&f.genes.separator=%3B&f.set.keepEmpty=false" -type text/csv ~/solr-data/SOLR-CDDTable-2.txt
java -classpath /opt/solr/dist/solr-core-5.3.0-PATRIC.jar -Dauto=yes -Dparams=separator=%09&f.genes.split=true&f.genes.separator=%3B&f.set.keepEmpty=false -Dtype=text/csv -Dc=fusion-cdd -Ddata=files org.apache.solr.util.SimplePostTool /homes/nconrad/solr-data/SOLR-CDDTable-2.txt
SimplePostTool version 5.0.0
Posting files to [base] url http://localhost:8983/solr/fusion-cdd/update?separator=%09&f.genes.split=true&f.genes.separator=%3B&f.set.keepEmpty=false...
Entering auto mode. File endings considered are xml,json,csv,pdf,doc,docx,ppt,pptx,xls,xlsx,odt,odp,ods,ott,otp,ots,rtf,htm,html,txt,log
POSTing file SOLR-CDDTable-2.txt (text/csv) to [base]
1 files indexed.
COMMITting Solr index changes to http://localhost:8983/solr/fusion-cdd/update?separator=%09&f.genes.split=true&f.genes.separator=%3B&f.set.keepEmpty=false...
Time spent: 0:14:31.458


