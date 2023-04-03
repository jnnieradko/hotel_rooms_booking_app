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

    const guestsUnder100 = useSelector(selectorGuestsUnder100)

    const guestsOverEqual100 = useSelector(selectorGuestsOverOrEqual100)

    const totalRevenue = useSelector(selectorRevenueTotal)

    const premiumRoomsRevenue = useSelector(selectorRevenuePremiumRooms)

    const economyRoomsRevenue = useSelector(selectorRevenueEconomyRooms)

    const extraPremiumRooms = useSelector(selectorExtraPremiumRooms)

    const occupiedPremiumRooms = useSelector(selectorOccupiedPremiumRooms)

    const occupiedEconomyRooms = useSelector(selectorOccupiedEconomyRooms)


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

    dataToUpdateState.updateExtraPremiumRooms = premiumRooms - guestsOverEqual100.length

    function update(pRTR, eRTR, pR, eR) {

        dataToUpdateState.updateRevenuePremiumRooms = pRTR
        dataToUpdateState.updateRevenueEconomyRooms = eRTR
        dataToUpdateState.updateTotalRevenue = pRTR + eRTR

        dataToUpdateState.updateOccupiedPremiumRooms = pR
        dataToUpdateState.updateOccupiedEconomyRooms = eR
    }


    if (guestsOverEqual100.length >= premiumRooms) {

        const premiumGuestsCanStay = guestsOverEqual100.slice(guestsOverEqual100.length - premiumRooms)

        if (premiumGuestsCanStay.length > 0) {
            const premiumRoomsTotalRevenue = premiumGuestsCanStay.reduce((total, num) => total + num)

            if (guestsUnder100.length <= economyRooms) {

                const economyRoomsTotalRevenue = guestsUnder100.reduce((total, num) => total + num)

                const freeEconomyRooms = economyRooms - guestsUnder100.length

                update(premiumRoomsTotalRevenue, economyRoomsTotalRevenue, premiumRooms, economyRooms - freeEconomyRooms)

            } else if (guestsUnder100.length > economyRooms) {

                const economyGuestsCanStay = guestsUnder100.slice(guestsUnder100.length - economyRooms)

                if (economyGuestsCanStay.length > 0) {
                    const economyRoomsTotalRevenue = economyGuestsCanStay.reduce((total, num) => total + num)
                    update(premiumRoomsTotalRevenue, economyRoomsTotalRevenue, premiumRooms, economyRooms)
                } else if (economyGuestsCanStay.length <= 0) {
                    update(premiumRoomsTotalRevenue, economyGuestsCanStay, premiumRooms, economyRooms)
                }
            }

        } else if (premiumGuestsCanStay.length <= 0) {

            if (guestsUnder100.length <= economyRooms) {

                const economyRoomsTotalRevenue = guestsUnder100.reduce((total, num) => total + num)

                let freeEconomyRooms = economyRooms - guestsUnder100.length

                update(premiumGuestsCanStay, economyRoomsTotalRevenue, premiumRooms, economyRooms - freeEconomyRooms)

            } else if (guestsUnder100.length > economyRooms) {

                const economyGuestsCanStay = guestsUnder100.slice(guestsUnder100.length - economyRooms)

                if (economyGuestsCanStay.length > 0) {
                    const economyRoomsTotalRevenue = economyGuestsCanStay.reduce((total, num) => total + num)
                    update(premiumGuestsCanStay, economyRoomsTotalRevenue, premiumRooms, economyRooms)
                } else if (economyGuestsCanStay.length <= 0) {
                    update(premiumGuestsCanStay, economyGuestsCanStay, premiumRooms, economyRooms)
                }
            }
        }
    } //..............................................................................................
    else if (guestsOverEqual100.length < premiumRooms) {
        let freePremiumRooms = premiumRooms - guestsOverEqual100.length
        let occupiedPremium = guestsOverEqual100.length

        let premiumRoomsTotalRevenue = guestsOverEqual100.reduce((total, num) => total + num)


        if (guestsUnder100.length <= economyRooms) {

            const economyRoomsTotalRevenue = guestsUnder100.reduce((total, num) => total + num)

            let freeEconomyRooms = economyRooms - guestsUnder100.length

            update(premiumRoomsTotalRevenue, economyRoomsTotalRevenue, premiumRooms - freePremiumRooms, economyRooms - freeEconomyRooms)

        } else if (guestsUnder100.length > economyRooms) {

            let howManyGuestsCanStayInEconomyRooms = economyRooms

            let howManyGuestNotFitEconomyRooms = guestsUnder100.length - economyRooms

            if (freePremiumRooms > howManyGuestNotFitEconomyRooms) {
                let howManyGuestWillUpgradeToPremiumRooms = howManyGuestNotFitEconomyRooms

                let upgradedGuests = guestsUnder100.slice(guestsUnder100.length - howManyGuestWillUpgradeToPremiumRooms)

                let upgradedGuestsTotalRevenue = upgradedGuests.reduce((total, num) => total + num)

                let potentialGuestsToStayInEconomyRooms = guestsUnder100.slice(0, guestsUnder100.length - upgradedGuests.length)

                let whoCanStayInEconomyRoom = potentialGuestsToStayInEconomyRooms.slice(potentialGuestsToStayInEconomyRooms.length - howManyGuestsCanStayInEconomyRooms)

                update(premiumRoomsTotalRevenue + upgradedGuestsTotalRevenue, whoCanStayInEconomyRoom, occupiedPremium + howManyGuestWillUpgradeToPremiumRooms, economyRooms)


            } else if (freePremiumRooms <= howManyGuestNotFitEconomyRooms) {
                let howManyGuestWillUpgradeToPremiumRooms = freePremiumRooms

                let upgradedGuests = guestsUnder100.slice(guestsUnder100.length - howManyGuestWillUpgradeToPremiumRooms)

                let upgradedGuestsTotalRevenue = upgradedGuests.reduce((total, num) => total + num)

                let potentialGuestsToStayInEconomyRooms = guestsUnder100.slice(0, guestsUnder100.length - upgradedGuests.length)

                let whoCanStayInEconomyRoom = potentialGuestsToStayInEconomyRooms.slice(potentialGuestsToStayInEconomyRooms.length - howManyGuestsCanStayInEconomyRooms)

                if (whoCanStayInEconomyRoom.length > 0) {

                    let economyRoomsTotalRevenue = whoCanStayInEconomyRoom.reduce((total, num) => total + num)

                    update(premiumRoomsTotalRevenue + upgradedGuestsTotalRevenue, economyRoomsTotalRevenue, occupiedPremium + howManyGuestWillUpgradeToPremiumRooms, economyRooms)

                } else if (whoCanStayInEconomyRoom.length <= 0) {

                    update(premiumRoomsTotalRevenue + upgradedGuestsTotalRevenue, whoCanStayInEconomyRoom, occupiedPremium + howManyGuestWillUpgradeToPremiumRooms, economyRooms)

                }
            }
        }
    }

    //..............................................................



    const handlePremiumRoomsChange = (event) => {
        setPremiumRooms(parseInt(event.target.value));
    };

    const handleEconomyRoomsChange = (event) => {
        setEconomyRooms(parseInt(event.target.value));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(submitReservationForm(dataToUpdateState))
    };

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
            <button type="submit">Calculate Profit & Occupancy</button>
            <div>Premium rooms revenue: {premiumRoomsRevenue} </div>
            <div>Economy rooms revenue: {economyRoomsRevenue} </div>
            <div>Total revenue: {totalRevenue} </div>
            <div>Occupied Premium rooms: {occupiedPremiumRooms}</div>
            <div>Occupied Economy rooms: {occupiedEconomyRooms}</div>


        </form>
    )

}

export default RoomInput