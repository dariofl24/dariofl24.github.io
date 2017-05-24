#/bin/bash

DATE=`date +%Y-%m-%d_%T`
MAX_BACKUP_FILES=5
ORIGINAL_DIR_NAME="datahub_jobs"
BACKUP_DIR_NAME="$ORIGINAL_DIR_NAME-$DATE"

BACKUP_DIR=".backups/$BACKUP_DIR_NAME"
BACKUP_ZIP=".backups/$BACKUP_DIR_NAME.tar.gz"

# prepare backup folders
if [ ! -d ".backups" ]; then
	mkdir .backups
fi

#Copying dir to backup
cp -Rf $ORIGINAL_DIR_NAME $BACKUP_DIR

# compressing the backup
tar -czf $BACKUP_ZIP $BACKUP_DIR
rm -rf $BACKUP_DIR

#Cleanning up backup files if needed
cd .backups
CURRENT_BACKUP_FILES=`find . -maxdepth 1 -type f | wc -l`
if [ "$CURRENT_BACKUP_FILES" -gt "$MAX_BACKUP_FILES" ] ; then
	TAIL_N_FILES=`expr $MAX_BACKUP_FILES - 1`
	ls -t1 . | tail -n$TAIL_N_FILES | xargs --no-run-if-empty rm
fi
