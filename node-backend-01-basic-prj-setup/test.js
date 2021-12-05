const axios = require("axios");

const userName = "bloomingmind.pl";

const url =`https://www.instagram.com/${userName}/`;

const testFunc = async () => {
    let ig;
    const res = [];
    try {
        ig = await axios.get(url)
        const userData = ig.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)
        const userInfo = JSON.parse(userData);
        const mediaArray = userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(0, 5);
        for (let media of mediaArray) {
            const node = media.node
            if ((node.__typename && node.__typename !== 'GraphImage')) {
                continue
            }
            res.push(node.thumbnail_src)
        }
    }catch(e) {
        console.error('Unable to retrieve photos. Reason: ' + e.toString())
    }

    return res;
}

// testFunc();