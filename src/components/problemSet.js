import Table from 'react-bootstrap/Table'
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import Container from "react-bootstrap/Container";

export default function ProblemSet(props) {

    const [componentProps, setComponentProps] = React.useState({problems:[]});
    const [isLoaded, setIsLoaded] = useState(false);

    function goBack(){
        window.location.reload(false);
    }

    function markCompleted(i){
        var localStorageItem = JSON.parse(localStorage.getItem("problemSets"));
        var currentProblemSet = localStorageItem[props.index];
        currentProblemSet.problems[i].solved = true;
        var tempProblems = currentProblemSet.problems;
        tempProblems[i].solved = true;
        localStorageItem[props.index] = currentProblemSet;
        localStorage.setItem('problemSets', JSON.stringify(localStorageItem));
        setComponentProps(
            {
                days: props.days,
                index: props.index,
                name: props.name,
                problems: tempProblems
            }
        )
    }

    function markUncompleted(i){
        var localStorageItem = JSON.parse(localStorage.getItem("problemSets"));
        var currentProblemSet = localStorageItem[props.index];
        currentProblemSet.problems[i].solved = false;
        var tempProblems = currentProblemSet.problems;
        tempProblems[i].solved = false;
        localStorageItem[props.index] = currentProblemSet;
        localStorage.setItem('problemSets', JSON.stringify(localStorageItem));
        setComponentProps(
            {
                days: props.days,
                index: props.index,
                name: props.name,
                problems: tempProblems
            }
        )
    }

    React.useEffect(() => {
        setComponentProps(props);
        setIsLoaded(true);
    }, [props])

    return (
        <Container>
            <Table responsive striped bordered hover>
                <thead>
                <tr>
                    <th style={{fontSize:"30px"}}>
                        {props.name}
                    </th>
                    <th>
                        <Button variant="primary" onClick={() => goBack()}>All Sets</Button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {componentProps.problems.map((question, i) => (
                    <>
                        {(i%props.days==0) ? <tr><th colSpan="2" style={{textAlign: "center"}}>Day {(i/props.days)+1}</th></tr> : <></>}
                        <tr>
                            <td>
                                <a href={`https://codeforces.com/contest/${question.contestId}/problem/${question.index}`}>{question.name}</a>
                            </td>
                            <td>
                                {(question.solved)
                                    ?<Button variant="success" onClick={() => markUncompleted(i)}>Completed</Button>
                                    :<Button variant="primary" onClick={() => markCompleted(i)}>Mark As Done</Button>}
                            </td>
                        </tr>
                    </>
                ))}
                </tbody>
            </Table>
        </Container>
    )
}

