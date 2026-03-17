#!/bin/bash
# Backup the SQLite database

BACKUP_DIR="backups"
DB_FILE="database.sqlite"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mkdir -p $BACKUP_DIR

if [ -f "$DB_FILE" ]; then
    sqlite3 $DB_FILE ".backup '$BACKUP_DIR/db_backup_$TIMESTAMP.sqlite'"
    echo "✅ Database backed up to $BACKUP_DIR/db_backup_$TIMESTAMP.sqlite"
else
    echo "❌ Database file not found!"
fi
