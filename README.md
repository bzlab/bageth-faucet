# BAGETH Faucet

Bu projede kullanıcı **MetaMask** cüzdanına bağlanır. Ardından cüzdanıyla ilgili bilgilerini görüp bir buton sayesinde içerisinde **Ethereum** bulunan bir cüzdandan her basışında 0.1 ETH olacak şekilde bir aktarım gerçekleştirilir.

## Bağımlılıklar

Bu projenin herhangi bir dependencies'i bulunmamaktadır.

## Proje Yapısı

Express react native'in build ettigi public dosyalari `/` pathinde serve eder

## Projeyi Çalıştırma

Aşağıdaki komutlarla projeyi çalıştırabilirsiniz.  

React Fronted Development mode

```sh
$ cd frontend
$ npm install
$ npm start
```

Express Backend

``` sh
$ npm install
$ node server.js
```

Docker container build etme
```sh
$ docker build -t bageth-faucet .
```