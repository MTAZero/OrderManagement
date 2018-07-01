const api = 'http://137.74.174.141:18000/vrpsolver/api/v1/vrp';

const getList = async (data) =>{
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

        var ans = [];
        ans = ans.concat(data.depot);

        for(var index = 1; index<2; index++){
            console.log(dt.tours[index].customers);
            for(var index2= 0; index2<dt.tours[index].customers.length; index2++){
                ans = ans.concat(dt.tours[index].customers[index2]);
            }
            ans = ans.concat(dt.tours[index].depot);
        }

        console.log("Ans : ",ans);

        return ans;
    })
    .then((dt) => {
        var ans = [];
        for(var  i=0; i<dt.length; i++){
            var Name = "Heii";
            var ID;
            //console.log("item : ",dt[i]);
            if (dt[i].customerID != null){
                ID = dt[i].customerID;
                data.requests.forEach(element => {
                    if (element.id == dt[i].customerID) Name = element.address
                });
            }
            else {
                ID = "D";
                Name = data.depot.address;
            }

            var item = {
                customerID: ID,
                latitude: dt[i].latitude,
                longitude: dt[i].longitude,
                name: Name
            };
            ans = ans.concat(item);
        }

        return ans;
    })
    .catch(err => {
        console.log("Get list Location error: "+err);
        return [];
    })

    return ans;

}

export default {getList};
