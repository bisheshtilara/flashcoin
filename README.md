# Flashcoin

> To get the app running

Requires .env file information
```
git clone git@github.com:EpitechMscProPromo2024/T-WEB-700-PAR_7.git flashcoin
cd flashcoin 
yarn 
yarn start
```

# Flashcoin Documentation
Flashcoin is the modern web application to get the latest crypto news and crypto information

## Built with 
> React 

> Tailwind 

> Firebase.

### Web App

> Hosted on https://flashcoin-94350.web.app/

There are three views in the web application

> Anonymous View, when no user is signed in.

> User View, when user is signed in. 

> Admin View, when an admin is signed in.

### Signin

User can signin with google or with email

<img width="491" alt="Screenshot 2023-01-05 at 12 00 21 AM" src="https://user-images.githubusercontent.com/90610832/210624699-b1ad5c89-b545-495c-bdc1-bc4fc6500db2.png">

### Signup

User can signup with google or with email

<img width="515" alt="Screenshot 2023-01-05 at 12 01 16 AM" src="https://user-images.githubusercontent.com/90610832/210624851-8d28a7e3-224b-44bf-b33a-0e7dd8ae9bad.png">


### Navigation - Sidebar 

Used to navigate throughout the app.

<img width="383" alt="Screenshot 2023-01-04 at 11 42 20 PM" src="https://user-images.githubusercontent.com/90610832/210621643-1aa9c638-992b-4267-8891-c9edc56c8bd8.png">

### News Card

Clickable to access the news 

<img width="1340" alt="Screenshot 2023-01-04 at 11 44 58 PM" src="https://user-images.githubusercontent.com/90610832/210622097-5c97c4d3-6f56-44f5-b7bb-4cf6c6b07835.png">

### Slidable Sidebar for top movers

<img width="362" alt="Screenshot 2023-01-04 at 11 45 58 PM" src="https://user-images.githubusercontent.com/90610832/210622297-10a33d74-7f79-44c7-acd2-2c002b497e9f.png">

### Cryto Coins List

Clickable to see visualised data

<img width="428" alt="Screenshot 2023-01-05 at 12 01 47 AM" src="https://user-images.githubusercontent.com/90610832/210624929-26e2343e-3350-491f-9d3c-ed56fea85da6.png">

### Visualised Chart Data

Can be filtered for

> The Date

> The Week

> The Year

> Lifetime

<img width="995" alt="Screenshot 2023-01-05 at 12 02 13 AM" src="https://user-images.githubusercontent.com/90610832/210625018-91953637-629c-4102-89e7-be15eb8dbb5f.png">

### Cryto Coins List Actions

> Favorites 

> Add to List

<img width="395" alt="Screenshot 2023-01-05 at 12 02 55 AM" src="https://user-images.githubusercontent.com/90610832/210625147-785c5700-36c8-4b0e-b983-8c8e8e24a2cc.png">

### Favorites

All the coins added to Favorites with visualized data

<img width="1419" alt="Screenshot 2023-01-05 at 12 03 30 AM" src="https://user-images.githubusercontent.com/90610832/210625202-7d5dc5b4-1f34-495c-b04d-e23595a84ab1.png">


### Coin List

> User can create a coin list

<img width="994" alt="Screenshot 2023-01-05 at 12 04 02 AM" src="https://user-images.githubusercontent.com/90610832/210625296-d4c264f2-9e7b-4b14-918d-a296dfe70f29.png">

> User can see details of the specific list they created

<img width="691" alt="Screenshot 2023-01-05 at 12 04 20 AM" src="https://user-images.githubusercontent.com/90610832/210625349-57b51802-e016-4f29-9952-d715b546ed1a.png">

### Profile

Here user can edit their

> Profile Picture

> Name

> Keywords for news

> See their coin lists

<img width="1414" alt="Screenshot 2023-01-05 at 12 04 43 AM" src="https://user-images.githubusercontent.com/90610832/210625425-746711b4-4d1a-48db-b43c-baf4ec2e634a.png">

### Edit Coins

Here the admin can set what coins are available to the anonoymous and user view.

<img width="1417" alt="Screenshot 2023-01-05 at 12 06 22 AM" src="https://user-images.githubusercontent.com/90610832/210625703-c027efc6-6e55-4c80-b051-07f72ce7c7d4.png">

### Edit News

Here the admin can decide what news is to be shown to the anonymous and user view.

<img width="1516" alt="Screenshot 2023-01-05 at 12 06 41 AM" src="https://user-images.githubusercontent.com/90610832/210625763-256b3bac-ba6e-48df-8aa2-c53d1b8afbb0.png">

# Backend Specific Documentation

For backend, firebase was decided to be used for its ease to handle the said project with OAuth.

### Connection to backend

Connection to backend is with the application key provided by firebase, which is stored in an env file for security purpose.

<img width="673" alt="Screenshot 2023-01-05 at 12 11 33 AM" src="https://user-images.githubusercontent.com/90610832/210626546-b5f9c1fd-cf60-4bb5-b04b-c7ca803f3af2.png">

### Authntication

<img width="1034" alt="Screenshot 2023-01-05 at 12 08 42 AM" src="https://user-images.githubusercontent.com/90610832/210626093-f0079ada-3b6a-4bed-a893-e59b58d319a9.png">

### Database

Database is stored in cloud firestore, with coinList for their history as well.

<img width="1263" alt="Screenshot 2023-01-05 at 12 12 31 AM" src="https://user-images.githubusercontent.com/90610832/210626653-b866ce01-25b9-4d24-b97a-cb9f7c234fd5.png">

### Storage

Firebase Storage is being used to store user profile photos. 

<img width="1425" alt="Screenshot 2023-01-05 at 12 15 55 AM" src="https://user-images.githubusercontent.com/90610832/210627203-636ef9d0-19fd-47e5-8ff2-8871ebeb3a0d.png">

### Security

Firebase lets us add security rules to make the app more secure.

<img width="1279" alt="Screenshot 2023-01-05 at 12 14 33 AM" src="https://user-images.githubusercontent.com/90610832/210626999-33e05d23-133c-41ed-b212-5d8158e640bb.png">

### Hosting

The web app is also hosted on firebase 

<img width="957" alt="Screenshot 2023-01-05 at 12 19 40 AM" src="https://user-images.githubusercontent.com/90610832/210627854-0d111ae9-4d42-47d6-97ab-3d8eebca179d.png">



