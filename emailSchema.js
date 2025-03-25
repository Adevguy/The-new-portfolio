import baseJoi from "joi"
import sanitizeHtml from "sanitize-html"
const extension = (joi) => ({
    type:"string",
    base:joi.string(),
    messages:{
        "string.escapeHTML": "{{#label}} should not contain HTML tags or special characters to ensure security.",
    },
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean = sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAttributes:{}
                })
                if (clean !== value) return helpers.error("string.escapeHTML",{value})
                return clean
            }
        }
    }
})

const Joi = baseJoi.extend(extension)

export const verifyContactForm = Joi.object({
    email:Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).escapeHTML(),
    username:Joi.string().required().escapeHTML(),
    message:Joi.string().required().escapeHTML()
})
