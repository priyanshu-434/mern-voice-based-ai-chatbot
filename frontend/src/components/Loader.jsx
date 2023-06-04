import { Spinner } from "react-bootstrap";

const Loader = () => {
    return (
        <Spinner
            animation="border"
            role="status"
            style={{
                width: '2rem',
                height: '2rem',
                margin: '1em auto 0',
                display: 'block',
            }} />
    );
}

export default Loader;