# William Turner
William Turner the one eyed pirate has a problem - this stack should help him.

for the story behind this see [README.md](../README.md) in the root of this repo!

## What you will need for this app to run

### cassandra 
You can Install Cassandra (2.2 or 3.0) or user a preconfigured [Cassandra Docker Image](https://hub.docker.com/_/cassandra/)

once installed you can import the schemafile to create keyspace and table

```shell
cqlsh -f config/cassandra.cql
```

or with docker:
```shell
# run the container with mapped volume for config files
docker run -d --name cass1 -v /absolute/path/to/config:/tmp/config cassandra
# import cql file within container
docker exec -it cass1 cqlsh -f /tmp/config/cassandra.cql
```

### nodejs
For the following Steps you will need [NodeJS 4](https://nodejs.org/)
For Linux system I can recommend [nvm based installation](https://github.com/creationix/nvm)

### setup project
within this directory run:
```shell
npm install -g bower
npm install -g grunt-cli
npm install
bower install
```
### run the app
within this directory run:
```shell
node ./
```

