import { StyleSheet, StatusBar } from 'react-native';

const style = StyleSheet.create({
    text_white :{
        color:'white'
    },
    back_black : {
        backgroundColor:'black'
    }
    ,
    scrollView: {
        backgroundColor: 'black',
    },
    text: {
        fontSize: 22,
    },
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.17)',
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        marginVertical: 0,
        borderRadius: 20,
    },
    tagBox: {
        paddingVertical: 5,
        paddingHorizontal: 18,
        marginHorizontal: 3,
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: 'rgba(0.1, 0.1, 0.1, 0.07)',
    },
    MusicContainer: {
        paddingVertical: 5,
        paddingHorizontal: 25,
        marginHorizontal: 3,
    },
    MusicBox: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        marginVertical: 1,
        width: 350,
        height: 80,
        flexDirection: 'row',
    },
    MusicStyle: {
        width: 60,
        height: 60,
    },
    Logo: {
        borderRadius: 100,
        borderColor: 'rgba(0.1, 0.1, 0.1, 0.2)',
        width: 35,
        height: 35,
        borderWidth: 1,
        marginLeft: 25,
        marginRight: 12
    },
    player: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: 100,
        height: 100,
        borderWidth: 1,
        marginRight: 40,
        borderColor: 'gray'
    },
    mypagebox1: {
        paddingLeft: 40,
        paddingTop: 20,
        marginBottom: 30,
        flex: 1
    },
    logoutbutton: {
        color: 'white',
        marginVertical: 10,
        borderColor: 'rgba(0.1, 0.1, 0.1, 0.15)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255, 0.25)'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgb(220,220,220)'
    },
    dragContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropzone: {
        backgroundColor: 'rgba(0, 0, 256, 0.5)',
    },
    square: {
        borderRadius: 15,
        backgroundColor: 'red',
    },
    container3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    draggable: {
        width: 100,
        height: 100,
        backgroundColor: 'blue',
    },
    receiver: {
        width: 100,
        height: 100,
        backgroundColor: 'green',
    }
});


export default style;