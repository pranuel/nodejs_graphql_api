import { Database, open } from 'sqlite';
import { IDatabaseProvider } from "../src/databaseProvider";

export class TestDatabaseProvider implements IDatabaseProvider {

    private db: Database = null;

    get database(): Database {
        return this.db;
    }

    initDatabase(): Promise<void> {
        // First, try to open the database:
        return open('./test_database.sqlite3')
            // Update db schema to the latest version using SQL-based migrations:
            .then(db => db.migrate({ force: 'last' }))
            .then(db => this.db = db)
            // return noop for void:
            .then(() => { });
    }

}
