module.exports = (client, data) => {
    let weapon = `${(data.weapon) ? data.weapon.split(" ").join("").split("'").join("").split("-").join("").split(".").join("").split(":").join("") : data.weapon}`;
    let ability = `${(data.ability) ? data.ability.split(" ").join("").split("'").join("").split("-").join("").split(".").join("").split(":").join("") : data.ability}`;
    let armor = `${(data.armor) ? data.armor.split(" ").join("").split("'").join("").split("-").join("").split(".").join("").split(":").join("") : data.armor}`;
    let ring = `${(data.ring) ? data.ring.split(" ").join("").split("'").join("").split("-").join("").split(".").join("").split(":").join("") : data.ring}`;
    let weaponID, abilityID, armorID;
    if (data.class === "Rogue" || data.class === "Trickster" || data.class === "Assassin") {
        weaponID = "583835875998302219";
    } else if (data.class === "Wizard" || data.class === "Necromancer" || data.class === "Mystic") {
        weaponID = "583834659893542913";
    } else if (data.class === "Sorcerer" || data.class === "Priest") {
        weaponID = "583843193683181568";
    } else if (data.class === "Ninja" || data.class === "Samurai") {
        weaponID = "583846022581714944";
    } else if (data.class === "Archer" || data.class === "Huntress") {
        weaponID = "583847032385699851";
    } else {
        weaponID = "583844990401380363";
    }
    if (data.class === "Rogue" || data.class === "Trickster" || data.class === "Assassin") {
        abilityID = "583807147134025750";
    } else if (data.class === "Wizard") {
        abilityID = "583853269512749057";
    } else if (data.class === "Necromancer" || data.class === "Mystic") {
        abilityID = "583860720114991124";
    } else if (data.class === "Sorcerer" || data.class === "Priest") {
        abilityID = "583867958963601409";
    } else if (data.class === "Ninja" || data.class === "Samurai") {
        abilityID = "583869373849010196";
    } else if (data.class === "Archer" || data.class === "Huntress") {
        abilityID = "583871706985398292";
    } else {
        abilityID = "583873260886687786";
    }
    if (data.class === "Rogue" || data.class === "Trickster" || data.class === "Assassin" || data.class === "Ninja" || data.class === "Huntress" || data.class === "Archer") {
        armorID = "583828681605251113";
    } else if (data.class === "Wizard" || data.class === "Necromancer" || data.class === "Mystic" || data.class === "Sorcerer" || data.class === "Priest") {
        armorID = "583839502905376780";
    } else {
        armorID = "583840744977203210";
    }
    return {
        weapon: (data.weapon) ? (client.guilds.get(weaponID).emojis.find(e => e.name === weapon) || "Not Found") : client.emojisMisc.get("blank"),
        ability: (data.ability) ? (client.guilds.get(abilityID).emojis.find(e => e.name === ability) || "Not Found") : client.emojisMisc.get("blank"),
        armor: (data.armor) ? (client.guilds.get(armorID).emojis.find(e => e.name === armor) || "Not Found") : client.emojisMisc.get("blank"),
        ring: (data.ring) ? (client.guilds.get("583831820215517220").emojis.find(e => e.name === ring) || client.guilds.get("583850748085796874").emojis.find(e => e.name === ring) || client.guilds.get("572241268680163358").emojis.find(e => e.name === ring) || "Not Found") : client.emojisMisc.get("blank"),
        backpack: (data.backpack === "Backpack") ? client.emojisMisc.get("backpack") : ""
    }
}