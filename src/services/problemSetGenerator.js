export default async function ProblemSetGenerator(props) {
    const response = await fetch("https://codeforces.com/api/problemset.problems?tags="+props.problemSetTopics);
    const final = await response.json();
    var problems=[];
    const temp = final.result.problems.splice(1,props.problemSetTotalDays);
    for(var i=0; i<temp.length;i++)
    {
        var obj = {};
        obj.name = temp[i].name;
        obj.contestId = temp[i].contestId;
        obj.index = temp[i].index;
        obj.solved = false;
        problems.push(obj);
    }
    return(problems);
}