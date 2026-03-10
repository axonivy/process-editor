
package net.webservicex.client;

import java.io.Serializable;
import javax.annotation.Generated;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;


/**
 * <p>Java class for GeoIP complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="GeoIP">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="ReturnCode" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="IP" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ReturnCodeDetails" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="CountryName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="CountryCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "GeoIP", propOrder = {
    "returnCode",
    "ip",
    "returnCodeDetails",
    "countryName",
    "countryCode"
})
@Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
public class GeoIP
    implements Serializable
{

    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    private final static long serialVersionUID = 1L;
    @XmlElement(name = "ReturnCode")
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    protected int returnCode;
    @XmlElement(name = "IP")
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    protected String ip;
    @XmlElement(name = "ReturnCodeDetails")
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    protected String returnCodeDetails;
    @XmlElement(name = "CountryName")
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    protected String countryName;
    @XmlElement(name = "CountryCode")
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    protected String countryCode;

    /**
     * Gets the value of the returnCode property.
     * 
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public int getReturnCode() {
        return returnCode;
    }

    /**
     * Sets the value of the returnCode property.
     * 
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public void setReturnCode(int value) {
        this.returnCode = value;
    }

    /**
     * Gets the value of the ip property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public String getIP() {
        return ip;
    }

    /**
     * Sets the value of the ip property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public void setIP(String value) {
        this.ip = value;
    }

    /**
     * Gets the value of the returnCodeDetails property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public String getReturnCodeDetails() {
        return returnCodeDetails;
    }

    /**
     * Sets the value of the returnCodeDetails property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public void setReturnCodeDetails(String value) {
        this.returnCodeDetails = value;
    }

    /**
     * Gets the value of the countryName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public String getCountryName() {
        return countryName;
    }

    /**
     * Sets the value of the countryName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public void setCountryName(String value) {
        this.countryName = value;
    }

    /**
     * Gets the value of the countryCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public String getCountryCode() {
        return countryCode;
    }

    /**
     * Sets the value of the countryCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public void setCountryCode(String value) {
        this.countryCode = value;
    }

    @Override
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    @Override
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public boolean equals(Object that) {
        return EqualsBuilder.reflectionEquals(this, that);
    }

    @Override
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }

}
