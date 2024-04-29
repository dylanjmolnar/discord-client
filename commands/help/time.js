module.exports = (myTime) => {
    let time = myTime / 1000;
    if (parseInt(time) > 60) {
        if (parseInt(time) > 3600) {
            if (parseInt(time) > 86400) {
                if (parseInt(time) > 604800) {
                    if (parseInt(time) > 31449600) {
                        let years = Math.floor(parseInt(time) / 31449600);
                        let weeks = Math.floor((parseInt(time) - (years * 31449600)) / 604800);
                        let days = Math.floor((parseInt(time) - (years * 31449600) - (weeks * 604800)) / 86400);
                        let hours = Math.floor((parseInt(time) - (years * 31449600) - (weeks * 604800) - (86400 * days)) / 3600);
                        let minutes = Math.floor((parseInt(time) - (years * 31449600) - (weeks * 604800) - (86400 * days) - (3600 * hours)) / 60);
                        let remainder = Math.floor(parseInt(time) - (years * 31449600) - (weeks * 604800) - (86400 * days) - (hours * 3600) - (minutes * 60));
                        return `${years} year${(years > 1 || years === 0) ? "s": ""}, ${weeks} week${(weeks > 1 || weeks === 0) ? "s": ""}, ${days} day${(days > 1 || days === 0) ? "s": ""}, ${hours} hour${(hours > 1 || hours === 0) ? "s": ""}, ${minutes} minute${(minutes > 1 || minutes === 0) ? "s": ""}, and ${remainder} second${(remainder > 1 || remainder === 0) ? "s": ""}`;
                    } else {
                        let weeks = Math.floor(parseInt(time) / 604800);
                        let days = Math.floor((parseInt(time) - (weeks * 604800)) / 86400);
                        let hours = Math.floor((parseInt(time) - (weeks * 604800) - (86400 * days)) / 3600);
                        let minutes = Math.floor((parseInt(time) - (weeks * 604800) - (86400 * days) - (3600 * hours)) / 60);
                        let remainder = Math.floor(parseInt(time) - (weeks * 604800) - (86400 * days) - (hours * 3600) - (minutes * 60));
                        return `${weeks} week${(weeks > 1 || weeks === 0) ? "s": ""}, ${days} day${(days > 1 || days === 0) ? "s": ""}, ${hours} hour${(hours > 1 || hours === 0) ? "s": ""}, ${minutes} minute${(minutes > 1 || minutes === 0) ? "s": ""}, and ${remainder} second${(remainder > 1 || remainder === 0) ? "s": ""}`;
                    }
                } else {
                    let days = Math.floor(parseInt(time) / 86400);
                    let hours = Math.floor((parseInt(time) - (86400 * days)) / 3600);
                    let minutes = Math.floor((parseInt(time) - (86400 * days) - (3600 * hours)) / 60);
                    let remainder = Math.floor(parseInt(time) - (86400 * days) - (hours * 3600) - (minutes * 60));
                    return `${days} day${(days > 1 || days === 0) ? "s": ""}, ${hours} hour${(hours > 1 || hours === 0) ? "s": ""}, ${minutes} minute${(minutes > 1 || minutes === 0) ? "s": ""}, and ${remainder} second${(remainder > 1 || remainder === 0) ? "s": ""}`;
                }
            } else {
                let hours = Math.floor(parseInt(time) / 3600);
                let minutes = Math.floor((parseInt(time) - (3600 * hours)) / 60);
                let remainder = Math.floor(parseInt(time) - (hours * 3600) - (minutes * 60));
                return `${hours} hour${(hours > 1 || hours === 0) ? "s": ""}, ${minutes} minute${(minutes > 1 || minutes === 0) ? "s": ""}, and ${remainder} second${(remainder > 1 || remainder === 0) ? "s": ""}`;
            }
        } else {
            let minutes = Math.floor(parseInt(time) / 60);
            let remainder = Math.floor(parseInt(time) - (minutes * 60));
            return `${minutes} minute${(minutes > 1 || minutes === 0) ? "s": ""} and ${remainder} second${(remainder > 1 || remainder === 0) ? "s": ""}`;
        }
    } else {
        return `${time} second${(time > 1 || time === 0) ? "s": ""}`;
    }
}