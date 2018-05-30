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
capteurs.
* Le back-end doit pouvoir traiter et normaliser les données issues des capteurs.
* Le back-end doit pouvoir fournir les données des capteurs par noeuds
(regroupement de plusieurs capteurs) ou par capteurs uniques.
* Le back-end doit pouvoir modifier le taux de rafraîchissement des capteurs.
* Le back-end doit permettre de pouvoir gérer des droits d'accès sur les endpoints.

### Authentification
Afin de garantir que seuls les utilisateurs autorisés puisse accéder/utiliser
l'API, des `JSON Web Tokens (JWT)` seront utilisés et devront être utilsés lors
des communications afin de savoir si un client est authentifié et autorisé à
accéder à la ressource souhaitée.

#### Obtenir un JWT

Un JWT peut être obtenu en se connectant avec un nom d'utilisateur et un mot passe valide. 
Pour ce faire il faut effectuer une requête HTTP `POST` sur le endpoint `/auth`. En paramètre, dans 
le body de la requête, il faut fournir un payload json contenant les informations mentionnées ci-dessus.

```javascript
{
    "username": "user",
    "password": "user1234"
}

```

Si l'utilisateur existe et que le mot de passe est valide, l'API REST retournera un réponse au format `text/plain`
et le JWT généré se trouvera dans le body de la requête.

#### Accéder à un endpoint protégé

Pour accéder à un endpoint protégé, il faudra ajouter le header `Authorization` à vos requêtes avec comme valeur 
`Bearer <JWT>` où `<JWT>` est à remplacer par le token récupéré à l'étape précédente. 

Si l'utilisateur pour lequel ce JWT a été généré a les droit d'accès (autorisation) au endpoint au question, la requête sera authentifiée et autorisée. Les deux rôles existants sont administrateur ou utilisateur par défaut.

Pour plus de détail, notamment sur les contraintes de validation du payload, consulter la [spécification de l'API REST](./dev/iot-rest-api/api/swagger/swagger.md). 

#### Utilisateurs existants par défaut

Deux utilisateurs existants par défaut sont créés au déploiement de l'API sur un serveur. Par défaut et en mode dévelopement ces utilisateurs sont: 


| Username  | Password       | Role                   |
| ----------| -------------- | ---------------------- |
| user      | user1234       | utilisateur par défaut |
| admin     | admin1234      | administrateur         |

Attention à ne pas garder ces mots de passes et nom d'utilisateurs lors du deploiement. Se référer à la section déploiement pour plus d'information.

### Représentations
Les différents éléments du monde réels sont représentés de la façon suivante:

* Un noeud est un regroupement de capteurs physiquement placés au même endroit.
* Un capteur comporte, à première vue, un capteur physique et le module de
communication de LoRa.
* Un capteur a un identifiant unique qui lui est associé et que l'on peut
récupérer pour identifier précisement le capteur.

### Éléments stockés dans la base de données
Deux principales collections seront stockés dans la base de donnée MongaDB:

* La collection `Users` qui contiendra les utilisateurs autorisés à accéder à l'API.
    * Dans le cadre de ce projet, chaque utilisateur sera stocké en dur.
    * Lorsqu'un utilisateur est authentifié, il se verra attribuer un identifant
    unique qu'il devra utiliser à chaque communication avec le
    serveur qui l'autorisera à accéder aux endpoints. Voir le chapitre
    [Authentification](#authentification) pour plus de détails.
    * La structure de l'objet est la suivante:
        * `id` - identifiant unique 
        * `username` - Le nom de l'utilisateur.
        * `password` - Le mot de passe (stocké de façon sécurisée).
        * `role` - le rôle (lié aux droits d'accès de l'utilisateur) [0: utilisateur normal | 1: administrateur]
* La collection `BlacklistedTokens` qui contiendra les tokens qui ne sont plus autorisés
à accéder à l'API.
    * Dans le cadre de ce projet, cette collection ne sera pas nettoyée
    automatiquement.
    * La structure de l'objet est la suivante:
        * `blacklisted_token` - Le token banni.
        * `date_added` - La date à laquelle l'objet a été ajouté à la blacklist.
* La collection `Sensors` qui contiendra toutes les descriptions des différents
capteurs.
    * La structure de l'objet est la suivante:
        * `id` - Identifiant unique du capteur (récupéré par le LoRa serveur).
        * `documentation_link` - Lien vers la documentation officielle du constructeur.
        * `date_created` - a date à laquelle l'objet a été créé.
        * `date_updated` - La dernière date de mise à jour de l'objet.
        * `active` - Permet de savoir si le capteur est encore actif ou s'il a été désactivé.
        * `refresh_interval` - Fréquence à laquelle le capteur doit fournir ses mesures.
        * `encoding` - L'encodage des données [METTRE LA DOCUMENTATION VERS LE FIRMWARE].
        * `values` - Tableau d'objets JSON correspond à l'`encoding`.
* La collection `Nodes` qui contiendra toutes les descriptions des différents
capteurs situés aux même endroit.
    * La structure de l'objet est la suivante:
        * `id` - Identifiant unique du noeud.
        * `location` - Localisation du noeud.
        * `date_created` - a date à laquelle l'objet a été créé.
        * `date_updated` - La dernière date de mise à jour de l'objet.
        * `active` - Permet de savoir si le noeud est encore actif ou s'il a été désactivé.
        * `sensors` - Tableau d'entiers correspondant aux identifiants des capteurs regroupés dans le noeud.

### Endpoints
Les différents endpoints et leurs définitions sont décrites [ici](https://github.com/heig-vd-iot2018/back-end/blob/master/dev/iot-rest-api/api/swagger/swagger.md) et sont générés à l'aide du module NPM [`swagger-markdown`](https://www.npmjs.com/package/swagger-markdown).

La définition des endpoints sera régulièrement mise à jour.

## Déploiement
Pour le déploiement, une configuration `Docker` a été créé. Les instructions sont disponibles [ici](https://github.com/heig-vd-iot2018/back-end/tree/master/dev).

## Conclusion
[Points à améliorer, points en suspens, améliorations futures, ...]

## Documentation supplémentaire
Toutes les librairies utilisées pour ce projet sont disponibles dans le [`package.json`](https://github.com/heig-vd-iot2018/back-end/blob/master/dev/iot-rest-api/package.json).
