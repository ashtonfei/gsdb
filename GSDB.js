"use strict"

// database column
class Column {
    constructor({ key, label, icon = null, type = 'text', length = 20, primaryKey = false, unique = false, nullable = true, autoNow = false, autoAddNow = false }) {
        this.key = key
        this.label = label || key
        this.icon = icon
        this.type = type
        this.length = 20
        this.primaryKey = primaryKey
        this.autoNow = autoNow
        this.autoAddNow = autoAddNow
    }
}


// database table
class Model {
    constructor(tableName, databaseId, columns) {
        this.tableName = tableName
        this.databaseId = databaseId
        this.columns = columns
        this.db = SpreadsheetApp.openById(this.databaseId)
        this.table = this.db.getSheetByName(tableName) || this.db.insertSheet(tableName)
        this.init()
    }

    init() {
        const labels = this.columns.map(({ label }) => label)
        const values = [labels]
        this.table.getRange(`1:1`).clear()
        this.table.getRange(1, 1, values.length, labels.length).setValues(values).setBackground("#eeeeee").setFontWeight("bold")
    }

    add(record) {
        //pass
        const values = this.columns.map(({ key }) => {
            return record[key] || null
        })
        this.table.appendRow(values)
    }

    frist(count = 1) {
        const items = this.all()
        if (count === 1) return items[0]
        return items.slice(0, count)
    }

    last(count = 1) {
        const items = this.all()
        if (count === 1) return items.pop()
        return items.slice(-count)
    }

    all() {
        const dataRange = this.table.getDataRange()
        const values = dataRange.getValues().slice(1)
        return values.map((v, i) => {
            const item = {}
            this.columns.forEach(({ key }, index) => {
                item[key] = v[index]
            })
            return item
        })
    }
}


/**
 * Demo 'User' model
 */
class User extends (Model) {
    constructor() {
        const databaseId = "1D_DWLjzUeBNkvC8B5YCKmLsnKwLbkmx5W5SCZAnc4eI"
        const tableName = "User"
        const columns = [
            new Column({
                key: "username",
                type: "text",
                label: "User name",
            }),
            new Column({
                key: "firstname",
                type: "text",
                label: "First Name",
            }),
            new Column({
                key: "lastname",
                type: "text",
                label: "Last Name",
            }),
        ]
        super(tableName, databaseId, columns)
    }
}

/**
 * Demo 'Product' model
 */
class Product extends (Model) {
    constructor() {
        const databaseId = "1D_DWLjzUeBNkvC8B5YCKmLsnKwLbkmx5W5SCZAnc4eI"
        const tableName = "Product"
        const columns = [
            new Column({
                key: "name",
                type: "text",
                label: "Product Name",
            }),
            new Column({
                key: "description",
                type: "text",
                label: "Description",
            }),
            new Column({
                key: "grossWeight",
                type: "number",
                label: "Gross weight",
            }),
            new Column({
                key: "netWeight",
                type: "number",
                label: "Net weight",
            }),
            new Column({
                key: "price",
                type: "number",
                label: "Price",
            }),
        ]
        super(tableName, databaseId, columns)
    }
}

/**
 * Debmo to user models
 */
function demo() {
    // create the user model
    const user = new User()
    // add a new user to database
    user.add({ username: "afei", firstname: "Ashton", lastname: "Fei" })
    // get all records from user model
    console.log(user.all())

    // get first item
    console.log(user.frist())

    // get first 2 item
    console.log(user.frist(2))

    // get last item
    console.log(user.last())

    // get last 2 item
    console.log(user.last(2))

    const product = new Product()
    product.add({
        name: "MG843",
        description: 'iPhone 12 mini',
        grossWeight: 130,
        netWeight: 135,
        price: 650,
    })
    product.add({
        name: "MG842",
        description: 'iPhone 12',
        grossWeight: 140,
        netWeight: 145,
        price: 760,
    })
    console.log(product.all())
}