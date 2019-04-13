


public edgeNailing = (obj, forceType, sheathing, thickness, fastener, spacing,dblSided) => {

    let res = (dblSided) ? obj[forceType][sheathing][thickness][fastener][spacing] : 
    0.5 * obj[forceType][sheathing][thickness][fastener][spacing];
     
    console.log(res);

    return res
}  