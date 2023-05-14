const timeDiff = (createdAt)=>{
    const difference = new Date() - createdAt;
    const min = Math.floor((difference / 1000 / 60) << 0);

return min;
}

export default timeDiff;