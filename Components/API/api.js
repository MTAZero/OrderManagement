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

        var res = [];

        for(var index = 0; index<dt.tours.length; index++){
            var itemIndex = {};
            itemIndex.distance = dt.tours[index].distance;
            itemIndex.duration = dt.tours[index].duration;
            
            var title = "Tour "+(index+1)+" : D";

            var ans = [];
            ans = ans.concat(data.depot);
            for(var index2= 0; index2<dt.tours[index].customers.length; index2++){
                ans = ans.concat(dt.tours[index].customers[index2]);
                title = title + "->"+dt.tours[index].customers[index2].customerID;
            }
            ans = ans.concat(dt.tours[index].depot);
            itemIndex.customers = ans;
            itemIndex.title = title+"->D";

            res = res.concat(itemIndex);
        }

        return res;
    })
    .then((dt) => {
        var res = [];

        for(var  index=0; index<dt.length; index++){

            var ans = [];
            for(var i=0; i<dt[index].customers.length; i++){
                var element = dt[index].customers[i];

                var Name = "Heii";
                var ID;
                //console.log("item : ",dt[i]);
                if (element.customerID != null){
                    ID = element.customerID;
                    data.requests.forEach(element1 => {
                        if (element1.id == element.customerID) Name = element1.address
                    });
                }
                else {
                    ID = "D";
                    Name = data.depot.address;
                }

                var item = {
                    customerID: ID,
                    latitude: element.latitude,
                    longitude: element.longitude,
                    name: Name
                };
                ans = ans.concat(item);
            }
            var itemIndex = {
                distance: dt[index].distance,
                duration: dt[index].duration,
                title: dt[index].title,
                customers: ans
            };

            res = res.concat(itemIndex);
        }

        console.log("res : ",res);

        return res;
    })
    .catch(err => {
        console.log("Get list Location error: "+err);
        return [];
    })

    return ans;

}

export default {getList};
