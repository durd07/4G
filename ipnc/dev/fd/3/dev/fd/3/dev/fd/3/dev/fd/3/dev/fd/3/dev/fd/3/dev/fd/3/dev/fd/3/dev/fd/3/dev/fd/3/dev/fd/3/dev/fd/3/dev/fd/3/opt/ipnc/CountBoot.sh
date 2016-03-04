
#!/bin/sh

FILE="/mnt/log/lhcs.log"
FLAG_boot="count_boot"
FLAG_stream="stream"
NEW_COUNT=1
OLD_COUNT=0
OLD_STREAM=Y
NEW_STREAM=N
if [ -f "$FILE" ]
then
	OLD_COUNT="$(grep "count_boot" "$FILE" | cut -d ':' -f 2)"
	echo $OLD_COUNT
	OLD_STREAM="$(grep "stream" "$FILE" | cut -d ':' -f 2)"
	if [ -n "$OLD_STREAM" ]
	then
		echo "change strem flag"
		sed -i "s/$OLD_STREAM/ $NEW_STREAM/" "$FILE"
	else
		echo "chang stream error"
	fi

	
	if [ -n "$OLD_COUNT" ]
	then
		NEW_COUNT=$((OLD_COUNT + 1))
		echo "NEW_COUNT:$NEW_COUNT"
		sed -i "s/$OLD_COUNT/ $NEW_COUNT/" "$FILE"
	else
		echo "chang boot_count error"
	fi
else
	printf "%s : %d\n%s : %c\n" "$FLAG_boot" "$NEW_COUNT" "$FLAG_stream" "$NEW_STREAM" >> "$FILE"
	
fi