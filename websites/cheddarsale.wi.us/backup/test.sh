#!/bin/bash 

for f in *.html; do
   newfile=$(echo $f | awk -F"?" '{print $2}')
   cp $f /var/www/cheddarsale.wi.us/$newfile
done
