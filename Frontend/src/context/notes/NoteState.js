import NoteContext from "./NoteContext";


const NoteState = (props) => {
    //To provide states globally using this js file
    // const s1 = {
    //     'name': 'Rahul',
    //     'class': '5b'
    // }
    // const [state, setState] = useState(s1);
    // const update = () => {
    //     setState({
    //         "name": "rahuull",
    //         "class": "12"
    //     }, 1000)
    // }
    return (
        <NoteContext.Provider >
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState