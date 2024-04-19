-- Função get_mqtt_password
CREATE OR REPLACE FUNCTION get_mqtt_password(plate_param TEXT) RETURNS TEXT LANGUAGE plpgsql
AS $$
DECLARE
    result TEXT;
BEGIN
    IF plate_param = 'anonymous' THEN
        SELECT 'anonymous' INTO result;
    ELSE
        SELECT "password" INTO result FROM "Bus" WHERE "plate" = plate_param AND "isActive" = true LIMIT 1;
    END IF;
    
    RETURN result;
END;
$$;

-- Função get_mqtt_acl
CREATE OR REPLACE FUNCTION get_mqtt_acl(param_plate TEXT, param_value INT) RETURNS TABLE(topic TEXT) LANGUAGE plpgsql AS
$$
BEGIN
    IF param_plate = 'anonymous' AND param_value = 1 THEN
        RETURN QUERY SELECT plate FROM "Bus";
    ELSIF param_plate <> 'anonymous' AND param_value = 2 THEN
        RETURN QUERY SELECT plate FROM "Bus" WHERE plate = param_plate;
    END IF;
END;
$$;
