# Internet of Things - Groupe back-end
Dans le cadre du cours IOT à la HEIG-VD, Suisse.

## Introduction
Ce repository est consacré à la partie "back-end" du projet de semestre du cours
*Internet of Things (IOT)* de la HEIG-VD, Suisse.

Le back-end est responsable de faire le lien entre les capteurs (qui nous
fournissent les données en passant par le serveur LoRa de la partie
"Infrastructure"), de traiter/normaliser les données et être capable de les
fournir au front-end. De plus, le front-end doit être capable de changer
l'intervalle de rafraîchissement du capteur.

*Note: Il s'agit d'un WIP. Des modifications seront apportées au fur et à mesure
du projet.*

## Technologies utilisées
Les technologies utilisées sont les suivantes:

* [`NodeJS`](https://nodejs.org/) - Le coeur du système.
* [`Swagger`](https://swagger.io/) - Permet de gérer les endpoints.
* [`MongoDB`](https://www.mongodb.com/) - Permet de stocker les données de façon
persistante.

## Spécificités

### Contraintes
Le back-end doit mettre à disposition une API permettant à un client de récupérer
les informations des différents capteurs. Voici les différentes contraintes de ce
dernier:

* Le back-end doit savoir quel est le format envoyé de la part de chacun des
capteurs
* Le back-end doit pouvoir traiter et normaliser les données issues des capteurs
* Le back-end doit pouvoir fournir les données des capteurs par noeuds
(regroupement de plusieurs capteurs) ou par capteurs uniques
* Le back-end doit pouvoir modifier le taux de rafraîchissement des capteurs
* Le back-end doit permettre de pouvoir gérer des droits d'accès sur les endpoints

### Représentations
Les différents éléments du monde réels sont représentés de la façon suivante:

* Un noeud est un regroupement de capteurs physiquement placés au même endroit.
* Un capteur comporte, à première vue, un capteur physique et le module de
communication de LoRa.
* Un capteur a un identifiant unique qui lui est associé et que l'on peut
récupérer pour identifier précisement le capteur.

### Éléments stockés dans la base de données
A FAIRE


### Endpoints
A FINIR
Voici les différents endpoints disponibles

1. POST - Endpoint pour les capteurs
    * Chaque capteur pousse ses données brutes
    * Décryptage des données?
    * Les données seront traitées et stocker dans une base de donnée

2. GET - Récupération des données traitée pour le Frontend

3. GET - Récupération des configurations des capteurs (Limitations, rang, etc)
    * Récupère la configuration d'un capteur spécifique

4. POST - Modification des fréquences d'un capteur

## Déploiement
[Instruction de déploiement/utilisation]

## Conclusion
[Points à améliorer, points en suspens, améliorations futures, ...]

## Documentation supplémentaire