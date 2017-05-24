BASEURL=https://staging.store.converse.demandware.net/on/demandware.servlet/webdav/Sites/Impex/src/instance
LOCALPATH=/tmp/staging_sync
FILEBASE=Daily_Backup-
USERNAME=syncuser
PASS=Drag00nade
rm -fR "${LOCALPATH}" 
REMOTEFILENAME=`curl -L -k --output - -u ${USERNAME}:${PASS} ${BASEURL} -s | sed -ne 's/<[^>]\{1,\}>//gp' | grep "${FILEBASE}" | grep "\.zip" |  sort -r | sed 's/\r//g'` 
LOCALFILENAME="${LOCALPATH}/Latest_Backup.zip"
set -- "${REMOTEFILENAME}"
MOST_RECENT_FN=($*[0])
curl -k --create-dirs --output "${LOCALFILENAME}" -u ${USERNAME}:${PASS} ${BASEURL}/${MOST_RECENT_FN}
