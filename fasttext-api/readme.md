🚀 Com executar
Desa els fitxers en una carpeta.

https://fasttext.cc/docs/en/crawl-vectors.html
Baixa cc.es.300.vec.gz i posa’l a la mateixa carpeta.
wget https://dl.fbaipublicfiles.com/fasttext/vectors-crawl/cc.es.300.vec.gz
wget https://dl.fbaipublicfiles.com/fasttext/vectors-crawl/cc.es.300.bin.gz

Entra a la carpeta i executa:

bash
docker build -t fasttext-api .

#docker run -p 5000:5000 fasttext-api

docker run -p 5000:5000 \
  -v /mnt/HDSK750/models/cc.es.300.bin:/app/cc.es.300.bin \
  fasttext-api

🧪 Exemple d’ús:
bash
curl http://localhost:5000/neighbors?word=relojería&top=5
