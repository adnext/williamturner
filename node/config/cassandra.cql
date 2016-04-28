-- turner cql example


CREATE KEYSPACE turner WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};

CREATE TABLE turner.turner_by_date (
    date date,
    ts timestamp,
    original_text text,
    turned_text text,
    PRIMARY KEY (date, ts)
) WITH CLUSTERING ORDER BY (ts DESC);
