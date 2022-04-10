const dropTableQuery = `
  DROP TABLE IF EXISTS football;
`;
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS football (
      team varchar,
      captain varchar,
      primary key("team")
  );
`;
const insertData = `
  INSERT INTO football (
    team, captain
  )
  VALUES
    ('Germany', 'Manuel Neuer'),
    ('Hungary', 'Adam Szalai'),
    ('Portugal', 'Cristiano Ronaldo'),
    ('France', 'Hugo Lloris'),
    ('Turkey', 'Burak Yilmaz'), 
    ('Italy', 'Giorgio Chiellini'),
    ('Wales', 'Gareth Bale'),
    ('Switzerland', 'Granit Xhaka'),
    ('Denmark', 'Simon Kjaer'),
    ('Finland', 'Tim Sparv'),
    ('Belgian', 'Eden Hazard'),
    ('Russia', 'Artem Dzyuba'),
    ('Netherlands', 'Georginio Wijnaldum'),
    ('Ukraine', 'Andriy Pyatov'),
    ('Austria', 'Julian Baumgartlinger'), 
    ('North Macedonia', 'Goran Pandev'),
    ('England', 'Harry Kane'),
    ('Croatia', 'Luka Modric'),
    ('Czech Republic', 'Vladimir Darida'),
    ('Scotland', 'Andrew Robertson'),
    ('Spain', 'Sergio Busquets'),
    ('Sweden', 'Andreas Granqvist'),
    ('Poland', 'Robert Lewandowski'),
    ('Slovakia', 'Marek Hamsík')
`;
const initDBData = (pgClient) => {
  pgClient.connect((err, client, done) => {
    if (err) {
        console.error(err);
        done()
        return;
    }
    client.query(dropTableQuery, (err, _) => {
      if (err) {
        console.error(err);
        done()
        return;
      }
      console.log('Table dropped')
    })
    client.query(createTableQuery, (err, _) => {
      if (err) {
        console.error(err);
        done()
        return;
      }
      console.log('Table created')
    })
    client.query(insertData, (err, _) => {
      if (err) {
        console.error(err);
        done()
        return;
      }
      console.log('Data inserted successful')
      done()
    })
  });
}

module.exports = {
  initDBData,
}