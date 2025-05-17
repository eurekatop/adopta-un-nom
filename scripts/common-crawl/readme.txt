https://commoncrawl.org/get-started
https://data.commoncrawl.org/crawl-data/CC-MAIN-2025-18/index.html






---------
 804  2025-05-12 16:12:53 cd github.com/eurekatop/adopta-un-nom/
  805  2025-05-12 16:12:54 ll
  806  2025-05-12 16:12:56 cd scripts/
  807  2025-05-12 16:12:57 ll
  808  2025-05-12 16:13:06 mkdir common-crawl
  809  2025-05-12 16:13:07 cd common-crawl/
  810  2025-05-12 16:13:28 nano readme.txt
  811  2025-05-12 16:14:25 ll
  812  2025-05-12 16:14:28 wget https://data.commoncrawl.org/crawl-data/CC-MAIN-2024-10/cc-index.paths.gz
  813  2025-05-12 16:14:32 ll
  814  2025-05-12 16:14:47 gunzip cc-index.paths.gz 
  815  2025-05-12 16:14:48 ll
  816  2025-05-12 16:14:52 nano cc-index.paths 
  817  2025-05-12 16:15:28 cat cc-index.paths 
  818  2025-05-12 16:16:24 nano cat-urls.sh
  819  2025-05-12 16:16:49 chmod u+x cat-urls.sh 
  820  2025-05-12 16:16:51 ./cat-urls.sh 
  821  2025-05-12 16:16:57 ll
  822  2025-05-12 16:17:05 nano cat-urls.sh 
  823  2025-05-12 16:17:43 ./cat-urls.sh 
  824  2025-05-12 16:19:09 nano cat-urls.1.sh 
  825  2025-05-12 16:19:23 chmod u+x cat-urls.1.sh 
  826  2025-05-12 16:19:28 ./cat-urls.1.sh 
  827  2025-05-12 16:19:59 wget https://data.commoncrawl.org/crawl-data/CC-MAIN-2024-10/cc-index.paths.gz
  828  2025-05-12 16:20:08 gunzip cc-index.paths.gz 
  829  2025-05-12 16:20:13 nano cc-index.paths 
  830  2025-05-12 16:20:28 wget https://data.commoncrawl.org/crawl-data/CC-MAIN-2024-10/cc-index/collections/CC-MAIN-2024-10/indexes/cdx-00000.gz
  831  2025-05-12 16:20:42 wget https://data.commoncrawl.org/crawl-data/cc-index/collections/CC-MAIN-2024-10/indexes/cdx-00000.gz
  832  2025-05-12 16:20:47 wget https://data.commoncrawl.org/cc-index/collections/CC-MAIN-2024-10/indexes/cdx-00000.gz
  833  2025-05-12 16:22:17 ll
  834  2025-05-12 16:22:20 ls -lrth
  835  2025-05-12 16:22:29 df -h
  836  2025-05-12 16:22:38 gunzip cdx-00000.gz 
  837  2025-05-12 16:22:51 df -h
  838  2025-05-12 16:22:57 watch df -h
  839  2025-05-12 16:23:21 ls -larth
  840  2025-05-12 16:23:27 trail cdx-00000 
  841  2025-05-12 16:23:31 tail cdx-00000 
  842  2025-05-12 16:23:43 tail -200 cdx-00000 
  843  2025-05-12 16:23:46 tail -200 cdx-00000  > test.txt
  844  2025-05-12 16:23:48 nano test.txt 
  845  2025-05-12 16:25:20 code  test.txt 
  846  2025-05-12 16:26:44 ll
  847  2025-05-12 16:26:50 nano parse cdx.sh
  848  2025-05-12 16:27:32 chmod u+x parse 
  849  2025-05-12 16:27:34 nano parse 
  850  2025-05-12 16:27:39 mv parse parse.sh
  851  2025-05-12 16:27:45 ./parse.sh test.txt 
  852  2025-05-12 16:27:51 nano parse.sh 
  853  2025-05-12 16:28:11 ./parse.sh test.txt 
  854  2025-05-12 16:28:14 nano parse.sh 
  855  2025-05-12 16:28:55 ./parse.sh test.txt 
  856  2025-05-12 16:29:00 nano parse.sh 
  857  2025-05-12 16:29:04 ./parse.sh test.txt 
  858  2025-05-12 16:29:07 nano parse.sh 
  859  2025-05-12 16:29:20 sur
  860  2025-05-12 16:29:21 surt
  861  2025-05-12 16:29:22 nano parse.sh 
  862  2025-05-12 16:30:03 ./parse.sh test.txt 
  863  2025-05-12 16:53:32 nano parse.sh 
  864  2025-05-12 16:54:42 ./parse.sh test.txt 
  865  2025-05-12 16:54:46 ll
  866  2025-05-12 16:54:50 df -h
  867  2025-05-12 16:54:53 ll
  868  2025-05-12 16:55:17 ./parse.sh cdx-00000 
  869  2025-05-12 16:55:30 nano parse.sh 
  870  2025-05-12 16:55:40 ./parse.sh cdx-00000 
  871  2025-05-12 16:56:26 nano parse.sh 
  872  2025-05-12 16:56:35 ./parse.sh cdx-00000 
  873  2025-05-12 16:56:39 nano parse.sh 
  874  2025-05-12 16:56:46 ./parse.sh cdx-00000 
  875  2025-05-12 16:56:49 nano parse.sh 
  876  2025-05-12 16:56:56 ./parse.sh cdx-00000 
  877  2025-05-12 16:57:35 htop
  878  2025-05-12 17:22:44 sudo openfortivpn
  879  2025-05-12 17:25:53 curl https://sign-share.bioiberica.net/
  880  2025-05-12 17:26:00 curl https://sign-share.bioiberica.net/ --verbose
  881  2025-05-12 17:26:16 curl https://sign-share.bioiberica.net/log/log.txt --verbose
  882  2025-05-12 17:26:47 curl https://sign-share.bioiberica.net/log/log.txt --verbose | more
  883  2025-05-12 17:33:19 traceroute sign-share.bioiberica.net
  884  2025-05-12 17:38:07 sudo openfortivpn
  885  2025-05-12 17:38:58 traceroute sign-share.bioiberica.net
  886  2025-05-12 17:40:05 telnet traefik-dmz.bioiberica.net 80
  887  2025-05-12 18:18:04 ll /home/rfranr/Downloads
  888  2025-05-12 18:18:14 ll /home/rfranr/Downloads/carrega-test-nosaltres-dades\ seves.xlsx 
  889  2025-05-12 18:18:17 nano /home/rfranr/Downloads/carrega-test-nosaltres-dades\ seves.xlsx 
  890  2025-05-12 18:21:29 nano '/home/rfranr/Documents/04-playmnotiv/GA250423.XLS' 
  891  2025-05-12 18:32:36 history

