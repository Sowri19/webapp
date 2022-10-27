module.exports = (sequelize , DataTypes) =>{
    const Document = sequelize.define("Document",{
     doc_id: {
        type : DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        readOnly: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        readOnly: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        readOnly: true,
    },
    s3_bucket_path: {
        type : DataTypes.STRING,
        allowNull: false,
        readOnly:true
    },
    },
    {
    createdAt:'date_created',
    updatedAt: false,
   
    });
    return Document;
    };

