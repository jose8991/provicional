{
    console.log("entro al responsive.js")
    let head = document.head || document.getElementsByTagName('head')[0]

    let style_responsive = document.createElement("style")

    let less_than_medias = {}
    let up_than_medias = {}
    let between_medias = {}

    function less_than(propiedad, valores, tamaño, clase) {
        if (!less_than_medias[tamaño]) {
            less_than_medias[tamaño] = {}
        }
        if (!less_than_medias[tamaño][clase]) {
            less_than_medias[tamaño][clase] = new Set()
        }
        less_than_medias[tamaño][clase].add(propiedad + ": " + valores + " !important;")
        console.log(less_than_medias)
    }

    function up_than(propiedad, valores, tamaño, clase) {
        if (!up_than_medias[tamaño]) {
            up_than_medias[tamaño] = {}
        }
        if (!up_than_medias[tamaño][clase]) {
            up_than_medias[tamaño][clase] = new Set()
        }
        up_than_medias[tamaño][clase].add(propiedad + ": " + valores + " !important;")
        console.log(up_than_medias)
    }

    function between(propiedad, valores, min, max, clase) {
        if (!between_medias[min]) {
            between_medias[min] = {}
        }
        if (!between_medias[min][max]) {
            between_medias[min][max] = []
        }
        if (!between_medias[min][max][clase]) {
            between_medias[min][max][clase] = new Set()
        }
        between_medias[min][max][clase].add(propiedad + ": " + valores + " !important;")
        console.log(between_medias)
    }

    document.querySelectorAll('*').forEach(function (node) {
        let clases = Array.from(node.classList)
        for (const clase of clases) {
            if (clase.match(/.+_.+-less-\d+px/ig)) {
                let elm0 = clase.split("-less-")
                let elm1 = elm0[0]
                let elm2 = elm0[1]
                let elm3 = elm1.replace("_", ";").split(";")
                let propiedad = elm3[0]
                let valores = elm3[1]
                less_than(propiedad, valores.replaceAll("_", " ").replaceAll(/PCNT/ig,"%"), elm2, clase)
            }
            if (clase.match(/.+_.+-up-\d+px/ig)) {
                let elm0 = clase.split("-up-")
                let elm1 = elm0[0]
                let elm2 = elm0[1]
                let elm3 = elm1.replace("_", ";").split(";")
                let propiedad = elm3[0]
                let valores = elm3[1]
                up_than(propiedad, valores.replaceAll("_", " ").replaceAll(/PCNT/ig,"%"), elm2, clase)
            }
            if (clase.match(/.+_.+-between-\d+px-\d+px/ig)) {
                let elm0 = clase.split("-between-")
                let elm1 = elm0[0]
                let elm2 = elm0[1].split("-")
                let elm3 = elm1.replace("_", ";").split(";")
                let propiedad = elm3[0]
                let valores = elm3[1]
                between(propiedad, valores.replaceAll("_", " ").replaceAll(/PCNT/ig,"%"), elm2[0], elm2[1], clase)
            }
        }
    })

    let medias = ""
    for (const sz in less_than_medias) {
        medias += `
            @media (max-width: ${sz}) {`
        for (const cls in less_than_medias[sz]) {
            medias += `
                .${cls} {
            `
            less_than_medias[sz][cls] = Array.from(less_than_medias[sz][cls])
            for (const property of less_than_medias[sz][cls]) {
                medias += property + "\n"
            }
            medias += `}
            `
        }
        medias += `
            }`
    }

    for (const sz in up_than_medias) {
        medias += `
            @media (min-width: ${sz}) {`
        for (const cls in up_than_medias[sz]) {
            medias += `
                .${cls} {
            `
            up_than_medias[sz][cls] = Array.from(up_than_medias[sz][cls])
            for (const property of up_than_medias[sz][cls]) {
                medias += property + "\n"
            }
            medias += `}
            `
        }
        medias += `
            }`
    }

    for (const min in between_medias) {
        for (const max in between_medias[min]) {
            medias += `
                @media (max-width: ${max}) and (min-width: ${min}) {`
            for (const cls in between_medias[min][max]) {
                medias += `
                    .${cls} {
                `
                between_medias[min][max][cls] = Array.from(between_medias[min][max][cls])
                for (const property of between_medias[min][max][cls]) {
                    medias += property + "\n"
                }
                medias += `}
                `
            }
            medias += `
                }`    
        }
        
    }

    style_responsive.innerHTML = medias

    head.appendChild(style_responsive)
}
