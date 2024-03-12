const getPointInfo = async (fid) => {
    try {
        const call = await fetch(
            `https://farcaster.dep.dev/lp/tips/${fid}`,
            {
                method: 'GET',
                headers: {
                    accept: 'application/json, text/plain, */*',
                    'accept-language': 'en-US,en;q=0.9',
                    'x-custom-app-version-tag': '6.0.2',
                },
            }
        );

        return await call.json();
    } catch (e) {
        return e;
    };
}


const getComunityInfo = async (page) => {
    try {
        const call = await fetch(
            `https://farcaster.dep.dev/lp/get-community-scores?page=${page}`,
            {
                method: 'GET',
                headers: {
                    accept: 'application/json, text/plain, */*',
                    'accept-language': 'en-US,en;q=0.9',
                    'x-custom-app-version-tag': '6.0.2',
                },
            }
        );

        return await call.json();
    } catch (e) {
        return e;
    };
}

const process = async () => {

    console.log(`Please Wait...`)
    let tableResult = []
    const totalPages = 30

    for (const mFid of listFID) {
        console.log(`Getting Info Account with FID : ${mFid}..`)

        let userNotFound = true
        let username = 'User Not Found'
        let score = '-'
        let updatedAt = '-'
        let spamCount = '-'

        let page = 0

        while (userNotFound) {
            page++
            if (page > totalPages) {
                userNotFound = false
                console.log(`User with FID ${mFid} Not Found`)
            }
            else {
                const comunityInfo = await getComunityInfo(page)
                for (const infoComunity of comunityInfo.data) {
                    if (mFid == infoComunity.fid) {
                        userNotFound = false
                        username = infoComunity.username
                        score = infoComunity.score
                        updatedAt = infoComunity.createdAt
                        spamCount = infoComunity.spamCount
                        if(spamCount == undefined){
                            spamCount = 0
                        }

                        console.log(`User with FID ${mFid} Founded`)
                    }
                }
            }
        }

        const hamPoint = await getPointInfo(mFid)
        if (!hamPoint.errors) {
            let remainingAllowance = hamPoint.allowance - hamPoint.used
            tableResult.push(
                {
                    Username: username,
                    Score: formatNumber(score),
                    Daily_Allowance: formatNumber(hamPoint.allowance),
                    Used: formatNumber(hamPoint.used),
                    Remaining_Allowance: formatNumber(remainingAllowance),
                    Tips_Received: formatNumber(hamPoint.received),
                    Updated_At: updatedAt,
                    Spam_Count: spamCount
                }
            )
        }
    }
    console.log(`\nResult:`)
    console.table(tableResult)

}
function formatNumber(number) {
    return number.toLocaleString('en-US')
}

const main = async () => {
    listFID = [
       //drop your FID
    ]

    process()


}

main();
