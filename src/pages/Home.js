import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {


    return (
        <Row>
            <Col className="mt-5 pt-5 text-center mx-auto">
                <h1>Welcome to our Movies API Website</h1>
                <p>Discover a world of films curated just for you. Stream with ease and enjoy exclusive releases!</p>
                <Link className="btn btn-primary" to={"/products"}>Browse Movies</Link>
                </Col>
        </Row>
    )
}