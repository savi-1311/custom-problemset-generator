import React, { useState} from 'react';
import Card from 'react-bootstrap/Card'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProblemSet from "./problemSet";
import ProblemSetGenerator from "../services/problemSetGenerator";

export default function HomePage() {

    const [isLoaded, setIsLoaded] = useState(false);
    const [homeDisplay, setHomeDisplay] = useState("block");
    const [problemSetDisplay, setProblemSetDisplay] = useState("none");
    const [existingProblemSet, setExistingProblemSet] = useState([]);
    const [currentProblem, setCurrentproblem] = useState([{problems:[{name: "Hello"}],name: "Hello"}]);
    const [currentProblemName, setCurrentproblemName] = useState("Sample Name");
    const [currentProblemDays, setCurrentproblemDays] = useState(5);
    const [currentProblemIndex, setCurrentproblemIndex] = useState(0);


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);


    function deleteActive(problemSetName){
        var deletedIndex = existingProblemSet.findIndex((question) => {
            return (question.name == problemSetName);
        });
        var tempQuestions = existingProblemSet;
        tempQuestions.splice(deletedIndex, 1);
        localStorage.setItem('problemSets', JSON.stringify(tempQuestions));
        setExistingProblemSet(tempQuestions);
        window.location.reload(false);
    }

    function showProblemSet(problemSet, index){
        setCurrentproblem(problemSet.problems);
        setCurrentproblemIndex(index);
        setCurrentproblemName(problemSet.name);
        setCurrentproblemDays(problemSet.eachDay);
        setHomeDisplay("none");
        setProblemSetDisplay("block");
    }

    async function onFormSubmit (e) {
        e.preventDefault()
        const formData = new FormData(e.target),
            formDataObj = Object.fromEntries(formData.entries())
        var topicString = "";
        for (const [key, value] of Object.entries(formDataObj)) {
            if (key !== "problemSetName" && key !== "problemSetTotalDays" && key !== "problemSetEachDay") {
                topicString += value + ";";
            }
        }

        const response = await ProblemSetGenerator({
            problemSetTopics: topicString,
            problemSetTotalDays: formDataObj["problemSetTotalDays"]*formDataObj["problemSetEachDay"]
        });

        var tempQuestions = existingProblemSet;
        tempQuestions.push({name: formDataObj.problemSetName,problems:response, totalDays:formDataObj.problemSetTotalDays, eachDay:formDataObj.problemSetEachDay});
        localStorage.setItem('problemSets', JSON.stringify(tempQuestions));
        window.location.reload(false);
    }

    function displayForm(){
        setShow(true);
    }

    React.useEffect(() => {
        var localStorageItem = JSON.parse(localStorage.getItem("problemSets"));
        setExistingProblemSet( localStorageItem|| []);
        setIsLoaded(true);
    }, [isLoaded])

    return (
        <>
            <div style={{display: homeDisplay}}>
                <Container  className="self-container">
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <Card bg="light" className="mb-2" text="dark" className="self-card" style={{border: "2px dashed #3b3a38"}} onClick={displayForm}>
                                <Card.Body style={{fontSize: "100px", color: "#3b3a38"}}>+</Card.Body>
                            </Card>
                        </Col>

                        {existingProblemSet.length ?
                            (<>{existingProblemSet.map((existingSet, i) => (
                                <Col md="auto">
                                    <Card bg="light" className="mb-2" text="dark" border="dark" className="self-card">
                                        <Card.Title style={{padding: "10px"}}>{existingSet.name}</Card.Title>
                                        <Row>
                                            <Col>
                                                <Button variant="success" onClick={() => showProblemSet(existingSet, i)}>
                                                    Solve
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button variant="danger" onClick={() => deleteActive(existingSet.name)}>
                                                    Delete
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            ))}</>)
                            :
                            (<></>)}
                    </Row>
                </Container>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Create Problem Set</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={onFormSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Problem Set Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter Unique Name" name="problemSetName" defaultValue="New ProblemSet"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Time Period (days)</Form.Label>
                                <Form.Control type="number" placeholder="Enter Number of Days" name="problemSetTotalDays" defaultValue={10}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Number of Questions per Day</Form.Label>
                                <Form.Control type="number" placeholder="Enter Number of Questions to solve each day" name="problemSetEachDay" defaultValue={5}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Binary Search" name="Binary Search" value="binary search"/>
                                <Form.Check type="checkbox" label="Brute Force" name="Brute Force" value="brute force"/>
                                <Form.Check type="checkbox" label="Data Structure" name="Data Structure" value="data structure"/>
                                <Form.Check type="checkbox" label="Dynamic Programming" name="Dynamic Programming" value="dp"/>
                                <Form.Check type="checkbox" label="Geometry" name="Geometry" value="geometry"/>
                                <Form.Check type="checkbox" label="Graphs" name="Graphs" value="graphs"/>
                                <Form.Check type="checkbox" label="Greedy" name="Greedy" value="greedy"/>
                                <Form.Check type="checkbox" label="Hashing" name="Hashing" value="hashing"/>
                                <Form.Check type="checkbox" label="Implementation" name="Implementation" value="implementation"/>
                                <Form.Check type="checkbox" label="Interactive" name="Interactive" value="interactive"/>
                                <Form.Check type="checkbox" label="Math" name="Math" value="math"/>
                                <Form.Check type="checkbox" label="Trees" name="Trees" value="trees"/>
                                <Form.Check type="checkbox" label="Strings" name="Strings" value="strings"/>
                                <Form.Check type="checkbox" label="Sorting" name="Sorting" value="sortings"/>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div style={{display: problemSetDisplay}}>
                <ProblemSet problems={currentProblem} name={currentProblemName} days={currentProblemDays} index={currentProblemIndex}></ProblemSet>
            </div>
        </>
    )
}

