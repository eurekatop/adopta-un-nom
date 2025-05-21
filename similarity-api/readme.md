#build
docker build -t similarity-api .
docker run -p 5000:5000 similarity-api

docker build -t similarity-api . ;docker run -p 5000:5000 similarity-api


#TEST
http://localhost:5000/similarity?word1=relojería&word2=joyería

http://localhost:5000/most_similar?word=relojería&candidates=joyería,obsesionar,nidación,batojar

#project
https://spacy.io/models/ca







{"question": "Cóctel similar a la caipiriña, pero sustituyendo la cachaza por vodka.", "options": "[\"perendengue\", \"kau\", \"sajadura\", \"alferazgo\", \"caipiroska\", \"follero\", \"antivotar\", \"solapar\", \"pequines\", \"nacencia\", \"chapeo\", \"joraca\", \"embozarse\", \"requisición\", \"plasma\", \"perpetuarse\", \"basicor\", \"profetizar\", \"característica\", \"vizcacha\"]", "correct": "caipiroska"}

[\"adecenar\", \"jaquematear\", \"nick\", \"encorsetarse\", \"estañar\", \"asteroideo\", \"alfabetización\", \"alzar\", \"singla\", \"termosellado\", \"filar\", \"vaporeta\", \"enfrentar\", \"espatario\", \"barajustar\", \"batojar\", \"chinita\", \"mismismo\", \"exhalarse\", \"muón\"]"

http://localhost:5000/most_similar?word=termosellado&candidates=adecenar, jaquematear, nick, encorsetarse, estañar, asteroideo, alfabetización, alzar, singla, termosellado, filar, vaporeta, enfrentar, espatario, barajustar, batojar, chinita, mismismo, exhalarse, muón