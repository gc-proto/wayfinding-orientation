# [".github/workflows/preview-html.yml","index.html", "landing.htm", ""]
# "${{ steps.printing.outputs.added_modified }}"
#!/bin/bash

array=$added_modified
array="${array//[}"
array="${array//]}"
array="${array//\"}"
output=""
url_preffix="https://covid-19-guidance.tbs.alpha.canada.ca/"
for i in $(echo $array | sed "s/,/ /g")
do
    if [ ${i: -4} = "html" ] || [ ${i: -3} = "htm" ]; then
    # call your procedure/other scripts here below
    output="${output} 
    ${url_preffix}${i}" 
    fi
done
echo $output

