function randomSample(d) {
    // Picks a random number of points from the array and returns them
    d = d3.shuffle(d);
    const percentToSample = Math.random();
    const numSamples = Math.round(percentToSample * d.length);
    return d.slice(0, numSamples)
}