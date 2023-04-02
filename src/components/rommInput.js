import {useDispatch, useSelector} from "react-redux";
import {submitReservationForm} from "../store/rooms/actions";
import {useState} from "react";
import {
    selectorSortedGuestsAsc,
    selectorGuestsUnder100,
    selectorGuestsOverOrEqual100,
    selectorRevenueTotal,
    selectorRevenuePremiumRooms,
    selectorRevenueEconomyRooms,
    selectorExtraPremiumRooms,
    selectorOccupiedPremiumRooms,
    selectorOccupiedEconomyRooms
} from "../store/rooms/selectors";

const RoomInput = () => {

    const dispatch = useDispatch()


    const guestsSortedASC = useSelector(selectorSortedGuestsAsc)
    console.log(guestsSortedASC)

    const guestsUnder100 = useSelector(selectorGuestsUnder100)
    console.log(guestsUnder100)

    const guestsOverEqual100 = useSelector(selectorGuestsOverOrEqual100)
    console.log(guestsOverEqual100)

    const totalRevenue = useSelector(selectorRevenueTotal)
    console.log("Total Revenue: " + totalRevenue)

    const premiumRoomsRevenue = useSelector(selectorRevenuePremiumRooms)
    console.log("Premium Rooms Revenue: " + premiumRoomsRevenue)

    const economyRoomsRevenue = useSelector(selectorRevenueEconomyRooms)
    console.log("Economy Rooms Revenue: " + economyRoomsRevenue)

    const extraPremiumRooms = useSelector(selectorExtraPremiumRooms)
    console.log("extra Premium Rooms: " + extraPremiumRooms)

    const occupiedPremiumRooms = useSelector(selectorOccupiedPremiumRooms)
    console.log("occupied Premium Rooms: " + occupiedPremiumRooms)

    const occupiedEconomyRooms = useSelector(selectorOccupiedEconomyRooms)
    console.log("occupied Economy Rooms: " + occupiedEconomyRooms)


    const [premiumRooms, setPremiumRooms] = useState(0);
    const [economyRooms, setEconomyRooms] = useState(0);

    const dataToUpdateState = {
        numberOfPremiumRooms: premiumRooms,
        numberOfEconomyRooms: economyRooms,
        updateOccupiedPremiumRooms: occupiedPremiumRooms,
        updateOccupiedEconomyRooms: occupiedEconomyRooms,
        updateRevenuePremiumRooms: premiumRoomsRevenue,
        updateRevenueEconomyRooms: economyRoomsRevenue,
        updateTotalRevenue: totalRevenue,
        updateExtraPremiumRooms: extraPremiumRooms,
    }
    //.............................................................
    //Assigning guests to rooms based on their willingness to pay
    console.log("Guests over: " + guestsOverEqual100.length)
    console.log("Guests under: " + guestsUnder100.length)

    dataToUpdateState.updateExtraPremiumRooms = premiumRooms - guestsOverEqual100.length

    function update(pRTR, eRTR, pR, eR) {

        dataToUpdateState.updateRevenuePremiumRooms = pRTR
        dataToUpdateState.updateRevenueEconomyRooms = eRTR
        dataToUpdateState.updateTotalRevenue = pRTR + eRTR

        dataToUpdateState.updateOccupiedPremiumRooms = pR
        dataToUpdateState.updateOccupiedEconomyRooms = eR
    }


    if (guestsOverEqual100.length === premiumRooms) {
        console.log("TC 1")
        console.log("Guests over 100: " + guestsOverEqual100.length)
        console.log("Guests under 100: " + guestsUnder100.length)
        console.log("Premium rooms: " + premiumRooms)
        console.log("Economy rooms: " + economyRooms)

        let premiumRoomsTotalRevenue = guestsOverEqual100.reduce((total, num) => total + num)

        if (guestsUnder100.length <= economyRooms) {
            console.log("TC 1a")
            console.log(guestsUnder100)
            console.log(guestsOverEqual100)
            const economyRoomsTotalRevenue = guestsUnder100.reduce((total, num) => total + num)

            /*                dataToUpdateState.updateRevenuePremiumRooms = premiumRoomsTotalRevenue
                            dataToUpdateState.updateRevenueEconomyRooms = economyRoomsTotalRevenue
                            dataToUpdateState.updateTotalRevenue =premiumRoomsRevenue + economyRoomsTotalRevenue

                            dataToUpdateState.updateOccupiedPremiumRooms = premiumRooms
                            dataToUpdateState.updateOccupiedEconomyRooms = economyRooms*/

            update(premiumRoomsTotalRevenue, economyRoomsTotalRevenue, premiumRooms, economyRooms)

        } else if (guestsUnder100.length > economyRooms) {
            console.log("TC 1b")

            const whoCanStay = guestsUnder100.slice(guestsUnder100.length - economyRooms)
            console.log(whoCanStay)

            if (whoCanStay.length > 0) {
                const economyRoomsTotalRevenue = whoCanStay.reduce((total, num) => total + num)
                console.log(economyRoomsTotalRevenue)
                update(premiumRoomsTotalRevenue, economyRoomsTotalRevenue, premiumRooms, economyRoomsRevenue)
            } else if (whoCanStay <= 0) {
                update(premiumRoomsTotalRevenue, whoCanStay, premiumRooms, economyRoomsRevenue)
            }
        }
        //..............................................................................................
    } else if (guestsOverEqual100.length > premiumRooms) {
        console.log(" TC 2")

        const whoPremiumCanStay = guestsOverEqual100.slice(guestsOverEqual100.length - premiumRooms)
        if (whoPremiumCanStay.length > 0) {
            console.log("TC 2a")
            const premiumRoomsTotalRevenue = whoPremiumCanStay.reduce((total, num) => total + num)
            console.log(premiumRoomsTotalRevenue)

            if (guestsUnder100.length <= economyRooms) {
                console.log("TC 1a")
                console.log(guestsUnder100)
                console.log(guestsOverEqual100)
                const economyRoomsTotalRevenue = guestsUnder100.reduce((total, num) => total + num)

                let freeRooms = economyRooms - guestsUnder100.length

                update(premiumRoomsTotalRevenue, economyRoomsTotalRevenue, premiumRooms, economyRooms - freeRooms)

            } else if (guestsUnder100.length > economyRooms) {
                console.log("TC 1b")

                const whoCanStay = guestsUnder100.slice(guestsUnder100.length - economyRooms)
                console.log(whoCanStay)

                if (whoCanStay.length > 0) {
                    const economyRoomsTotalRevenue = whoCanStay.reduce((total, num) => total + num)
                    console.log(economyRoomsTotalRevenue)
                    update(premiumRoomsTotalRevenue, economyRoomsTotalRevenue, premiumRooms, economyRooms)
                } else if (whoCanStay <= 0) {
                    update(premiumRoomsTotalRevenue, whoCanStay, premiumRooms, economyRoomsRevenue)
                }
            }

        } else if (whoPremiumCanStay <= 0) {
            console.log("TC 2b")

            console.log(whoPremiumCanStay)

            if (guestsUnder100.length <= economyRooms) {
                console.log("TC 1a")
                console.log(guestsUnder100)
                console.log(guestsOverEqual100)
                const economyRoomsTotalRevenue = guestsUnder100.reduce((total, num) => total + num)

                update(whoPremiumCanStay, economyRoomsTotalRevenue, premiumRooms, economyRooms)

            } else if (guestsUnder100.length > economyRooms) {
                console.log("TC 1b")

                const whoCanStay = guestsUnder100.slice(guestsUnder100.length - economyRooms)
                console.log(whoCanStay)

                if (whoCanStay.length > 0) {
                    const economyRoomsTotalRevenue = whoCanStay.reduce((total, num) => total + num)
                    console.log(economyRoomsTotalRevenue)
                    update(whoPremiumCanStay, economyRoomsTotalRevenue, premiumRooms, economyRoomsRevenue)
                } else if (whoCanStay <= 0) {
                    update(whoPremiumCanStay, whoCanStay, premiumRooms, economyRoomsRevenue)
                }
            }
        }
    } //..............................................................................................
    else if (guestsOverEqual100.length < premiumRooms) {
        console.log("TC 3")
        let extraRooms = premiumRooms - guestsOverEqual100.length
        console.log(extraRooms)

        let premiumRoomsTotalRevenue = guestsOverEqual100.reduce((total, num) => total + num)


        if (guestsUnder100.length <= economyRooms) {
            console.log("TC 1a")
            console.log(guestsUnder100)
            console.log(guestsOverEqual100)
            const economyRoomsTotalRevenue = guestsUnder100.reduce((total, num) => total + num)

            update(premiumRoomsTotalRevenue, economyRoomsTotalRevenue, premiumRooms - extraRooms, economyRooms - extraRooms)

        } else if (guestsUnder100.length > economyRooms) {

            let howManyGuestsCanStayInEconomyRooms = economyRooms
            console.log(howManyGuestsCanStayInEconomyRooms)

            let howManyGuestsCanUpgradeToPremiumRooms = extraRooms
            console.log(howManyGuestsCanUpgradeToPremiumRooms)


            let upgradedGuestsTotalRevenue = guestsUnder100.slice(guestsUnder100.length - extraRooms).reduce((total, num) => total + num)
            console.log(upgradedGuestsTotalRevenue)

            let potentialGuestsToStayInEconomyRooms = guestsUnder100.slice(0, guestsUnder100.length - howManyGuestsCanUpgradeToPremiumRooms)
            console.log(potentialGuestsToStayInEconomyRooms) //suma


            if (howManyGuestsCanStayInEconomyRooms > 0) {

                let whoIsHighestPayingInEconomy = potentialGuestsToStayInEconomyRooms.slice(potentialGuestsToStayInEconomyRooms.length - howManyGuestsCanStayInEconomyRooms)
                console.log(whoIsHighestPayingInEconomy)

                let economyRoomsTotalRevenue = whoIsHighestPayingInEconomy.reduce((total, num) => total + num)
                console.log(economyRoomsTotalRevenue)

                update(premiumRoomsTotalRevenue + upgradedGuestsTotalRevenue, economyRoomsTotalRevenue, premiumRooms, economyRooms)


            } else if (howManyGuestsCanStayInEconomyRooms <= 0) {

                update(premiumRoomsTotalRevenue + upgradedGuestsTotalRevenue, howManyGuestsCanStayInEconomyRooms, premiumRooms, economyRooms)


            }

        }


    }

    //..............................................................

    console.log(dataToUpdateState)


    const handlePremiumRoomsChange = (event) => {
        setPremiumRooms(parseInt(event.target.value));
    };

    const handleEconomyRoomsChange = (event) => {
        setEconomyRooms(parseInt(event.target.value));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(dataToUpdateState)
        dispatch(submitReservationForm(dataToUpdateState))
    };

    console.log(typeof premiumRoomsRevenue)
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Premium Rooms:
                <input
                    value={premiumRooms}
                    placeholder="please fill"
                    onChange={handlePremiumRoomsChange}
                />
            </label>
            <label>
                Economy Rooms:
                <input
                    value={economyRooms}
                    placeholder="please fill"
                    onChange={handleEconomyRoomsChange}
                />
            </label>
            <button type="submit">Oblicz przychód</button>
            <div>Przychód z pokoi Premium: {premiumRoomsRevenue} </div>
            <div>Przychód z pokoi Economy: {economyRoomsRevenue} </div>
            <div>Przychód całkowity: {totalRevenue} </div>
            <div>Liczba zajętych pokoi Premium: {occupiedPremiumRooms}</div>
            <div>Liczba zajętych pokoi Economy: {occupiedEconomyRooms}</div>


        </form>
    )

}

export default RoomInput