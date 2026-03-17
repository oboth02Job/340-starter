
-- INSERT to account (Query #1)
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n'
);

--UPDATE account_type to 'Admin' (Query #2)
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

--delete the account (Query #3)
DELETE FROM account
WHERE account_email = 'tony@starkent.com';


-- UPDATE GM Hummer description (Query #4)
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--using join to get inventory items with classification name 'Sport' (Query #5)
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory AS i
INNER JOIN public.classification AS c
ON i.classification_id = c.classification_id
WHERE c.classification_name ='Sport';

-- UPDATE inventory image paths (Query #6)
UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

