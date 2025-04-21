const data = [
    {
        key: 'accessToken',
        value: 'programmer'
    }
];

function getData(keyName){
    return data.find(i => i.key === keyName);
}

const token = getData("accessToken");

// console.log(token);
if(token){
    console.log('I see!!', token.value);
}else{
    console.log('I can\'n see this!')
}