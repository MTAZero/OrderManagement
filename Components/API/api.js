import data from './customer.json';
const api = 'http://137.74.174.141:18000/vrpsolver/api/v1/vrp';

const getList = async () =>{
    var ans = await fetch(api, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            data
        ),
    })
    .then((data) => data.json())
    .then((dt) => {
        console.log("data : ",dt);
        return dt.tours[0].customers;
    })
    .then((dt) => {
        var ans = [];
        for(var  i=0; i<dt.length; i++){
            var Name = "Heii";
            //console.log("item : ",dt[i]);
            data.requests.forEach(element => {
                if (element.id == dt[i].customerID) Name = element.address
            });
            var item = {
                customerID: dt[i].customerID,
                latitude: dt[i].latitude,
                longitude: dt[i].longitude,
                name: Name
            };
            ans = ans.concat(item);
        }

        console.log(ans);

        return ans;
    })
    .catch(err => {
        console.log("Get list Location error: "+err);
        return [];
    })

    return ans;

}

export default {getList};
