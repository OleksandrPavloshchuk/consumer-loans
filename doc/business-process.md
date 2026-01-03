# Consumer loan business process

## Purpose
To model the simplified business process for granting of consumer goals as tutorial artifact.

## Actors and operations

### Credit consultant
**Credit consultant** accepts name of consumer, name of good and amount of loan, sends information to 
**person check engine** and **person finance check engine**, receives information from **scoring engine**
or **back officer** and approves or declines loan. If loan approved, he prints loan document. Order is created
in database.

### Person check engine
**Person check engine** accepts person's name and gather information about good faith. It generates some scoring value
with lists of reasons and sends it with list of reasons to **scoring engine**. We use random scoring and reasons 
generator in this case for tutorial purposes. Scores and reasons are written to database.

### Person finance check engine
**Person finance check engine** accepts person's name and loan amount. It checks the ability of person to return 
the loan and send it with list of reasons to **scoring engine**. We use random scoring and reasons
generator in this case for tutorial purposes. Scores and reasons are written to database.

### Scoring engine
**Scoring engine** accepts person check and finance check scores from corresponding engines, calculates summa of them
and makes a solution in accordance with it:
* if summa is below a low threshold from configuration, it declines an order and sends it back to **credit consultant**
* if summa is above a high threshold from configuration, it approves an order and sends it back to **credit consultant**
* if summa is between low and high thresholds, it sends an order with scores and reason lists to **back officer**.
Status of order is written to database.

### Back officer
**Back officer** accepts doubtful order with scores and reasons from **scoring engine**, reviews it
and makes a decision to approve or decline order. Status of order is written to database. 
This decision is sent back to **credit consultant**.

## Process invariants
- Each loan application is processed exactly once.
- A loan application always ends in one and only one final state: APPROVED or REJECTED.
- Automated engines may produce final decisions only when the aggregated score is outside predefined threshold boundaries.
- Manual review is performed only for doubtful scoring results.
- Credit consultant is the only role that communicates the final decision to the customer.



